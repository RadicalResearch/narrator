namespace RadicalResearch.Narrator.Transcoder
{
    using System;
    using System.Diagnostics;
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;

    using Microsoft.Azure.WebJobs;
    using Microsoft.WindowsAzure.Storage.Blob;

    // To learn more about Microsoft Azure WebJobs SDK, please see http://go.microsoft.com/fwlink/?LinkID=320976
    public class Program
    {
        // Please set the following connection strings in app.config for this WebJob to run:
        // AzureWebJobsDashboard and AzureWebJobsStorage
        public static void Main()
        {
            var host = new JobHost();
            host.RunAndBlock();
        }

        public static async Task ProcessPcmAudioToMp3(
            [QueueTrigger("audio-transcode")]string audioBlobName,
            [Blob("audio-pcm/{queueTrigger}")] ICloudBlob input,
            [Blob("audio/{queueTrigger}.mp3")] ICloudBlob output,
            TextWriter log)
        {
            using (var outputStream = new MemoryStream())
            {
                var inputStream = await input.OpenReadAsync();

                log.WriteLine("transcoding {0}", audioBlobName);
                await TranscodeMp3(inputStream, outputStream, log);

                log.WriteLine("uploading blob");
                outputStream.Seek(0, SeekOrigin.Begin);
                output.UploadFromStream(outputStream);
            }

            log.WriteLine("setting blob properties");
            output.Properties.ContentType = "audio/mp3";
            output.SetProperties();

            log.WriteLine("complete");
        }

        private static async Task TranscodeMp3(Stream input, Stream output, TextWriter log)
        {
            const int OutputBitRate = 32;
            const int BitWidth = 16;
            const double SampleRate = 44.1;

            var arguments = new StringBuilder();

            // read the input file as a raw (headerless) PCM stream
            arguments.Append("-r ");

            // input sampling frequency in kHz(Default 44.1Khz)
            arguments.Append("-s ");
            arguments.Append(SampleRate);
            arguments.Append(" ");

            // input is signed (default)
            arguments.Append("--signed ");

            // input bit width (default 16)
            arguments.Append("--bitwidth  ");
            arguments.Append(BitWidth);
            arguments.Append(" ");

            // downmix stereo file to mono file for mono encoding.
            // arguments.Append("-a ");

            // Mono
            arguments.Append("-m m ");

            // Mono
            arguments.Append("-q 0 ");

            // output bitrate
            arguments.Append("-b ");
            arguments.Append(OutputBitRate);
            arguments.Append(" ");

            // lowpass and highpass
            arguments.Append("--lowpass 4.5 ");
            arguments.Append("--highpass 0.2 ");

            // Input Standard in
            arguments.Append("- ");

            // Output Standard Out
            arguments.Append("- ");

            var exeFilePath = "Lib\\lame.exe";

            var processStartInfo = new ProcessStartInfo
            {
                FileName = exeFilePath,
                Arguments = arguments.ToString(),
                UseShellExecute = false,
                CreateNoWindow = false,
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                WindowStyle = ProcessWindowStyle.Normal
            };

            Console.WriteLine("lame.exe " + arguments);
            var process = Process.Start(processStartInfo);
      
            var inputStream = process.StandardInput.BaseStream;
            var outputStream = process.StandardOutput.BaseStream;

            input.Seek(0, SeekOrigin.Begin);
            Task.WaitAll(
                CopyStream(input, inputStream, true),
                CopyStream(outputStream, output, false)
            );

            process.WaitForExit();
        }

        private static async Task CopyStream(Stream srcStream, Stream destStream, bool close)
        {
            await srcStream.CopyToAsync(destStream);
            if (close)
            {
                destStream.Close();
            }
        }
    }
}
