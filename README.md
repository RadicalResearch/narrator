# Narrator #

## About ##
- Record words and share with others
- Listen to words others have shared

## Development prerequasites ##
- Node.js and NPM - used for tooling.

## Project creation log ##
- `git init` - Create git reop
- Scaffold Application Using Yeoman
 - `npm install -g generator-aspnet` Install Yeoman
 - create 'src' folder
 - `yo aspnet` - Run the aspnet generator
 - DNX Restore packadges

## Development environment setup ##
- [Installing ASP.NET 5](https://docs.asp.net/en/latest/getting-started/installing-on-windows.html#install-asp-net-5-from-the-command-line)
 - Install the .NET Version Manager (DNVM)<br/>
   <code>
   @powershell -NoProfile -ExecutionPolicy unrestricted -Command "&{$Branch='dev';iex ((new-object net.webclient).DownloadString('https://raw.githubusercontent.com/aspnet/Home/dev/dnvminstall.ps1'))}"
   </code>
 - Install the .NET Execution Environment (DNX)<br>
    <code>
    dnvm upgrade -r clr
    </code>
- DNX Restore packadges - VSCode dnx command
- `dnu commands install Microsoft.Dnx.Watcher` Install Dnx.Watcher






