namespace RadicalResearch.Narrator.Website.Controllers
{
    using System.Collections.Generic;

    using Microsoft.AspNet.Mvc;
    using System.Threading.Tasks;

    using Microsoft.AspNet.Http;
    using System.Linq;

    using Microsoft.Extensions.OptionsModel;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Blob;
    using Microsoft.WindowsAzure.Storage.Queue;

    public class AudioController : Controller
    {
        private readonly IOptions<AppSettings> appSettings;

        public AudioController(IOptions<AppSettings> appSettings)
        {
            this.appSettings = appSettings;
        }

        // POST api/audio
        [Route("api/audio")]
        [HttpPost]
        public async Task Post(AudioPost audioPost)
        {
            // Push PCM data into a blob
            var storageAccount = CloudStorageAccount.Parse(this.appSettings.Value.Storage);
            var blobClient = storageAccount.CreateCloudBlobClient();
            var container = blobClient.GetContainerReference("audio-pcm");
            var blobName = audioPost.Word.ToUpperInvariant();

            var index = 0;
            var blockBlob = container.GetBlockBlobReference(blobName);
            while (blockBlob.Exists())
            {
                index++;
                blobName = string.Concat(audioPost.Word.ToUpperInvariant(), ".", index);
                blockBlob = container.GetBlockBlobReference(blobName);
            }
            
            using (var stream = audioPost.File.OpenReadStream())
            using(var blobStream = await blockBlob.OpenWriteAsync())
            {
                await stream.CopyToAsync(blobStream);
            }

            // Add transcode message to queue
            var queueClient = storageAccount.CreateCloudQueueClient();
            var queue = queueClient.GetQueueReference("audio-transcode");
            await queue.AddMessageAsync(new CloudQueueMessage(blobName));
        }

        // GET api/audio
        [Route("api/audio")]
        [HttpGet]
        public async Task<IList<string>> Get()
        {
            var storageAccount = CloudStorageAccount.Parse(this.appSettings.Value.Storage);
            var blobClient = storageAccount.CreateCloudBlobClient();
            var container = blobClient.GetContainerReference("audio");
            BlobContinuationToken continuationToken = null;
            var results = new List<string>();
            do
            {
                var response = await container.ListBlobsSegmentedAsync(continuationToken);
                continuationToken = response.ContinuationToken;
                results.AddRange(response.Results.Select(x => x.Uri.AbsoluteUri));
            }
            while (continuationToken != null);
            return results;
        }
    }

    public class AudioPost
    {
        public string Word { get; set; }

        public IFormFile File { get; set; }
    }
}
