# Narrator #

## About ##
- Record words and share with others
- Listen to words others have shared

## Project creation log ##
- `git init` - Create git reop
- Scaffold Application Using Yeoman
 - `npm install -g generator-aspnet` Install Yeoman
 - `mkdir src` - Create 'src' folder
 - `yo aspnet` - Run the aspnet generator
 - Run DNX restore to restore packadges
- [Install jspm](http://developer.telerik.com/featured/choose-es6-modules-today/)
 - `npm install jspm/jspm-cli -g` - global CLI
 - `npm install jspm --save-dev` - local jspm packadge
- [Configure jspm](http://odetocode.com/blogs/scott/archive/2015/02/18/using-jspm-with-visual-studio-2015-and-asp-net-5.aspx)
 - `jspm init` - (choose no transpiler)


## Development environment setup ##
- [Installing ASP.NET 5](https://docs.asp.net/en/latest/getting-started/installing-on-windows.html#install-asp-net-5-from-the-command-line)
 - Install the .NET Version Manager (DNVM)<br/>
   <code>
   @powershell -NoProfile -ExecutionPolicy unrestricted -Command "&{$Branch='dev';iex ((new-object net.webclient).DownloadString('https://raw.githubusercontent.com/aspnet/Home/dev/dnvminstall.ps1'))}"
   </code>
 - `dnvm upgrade -r clr` - Install the .NET Execution Environment (DNX)
- `dnx restore` - Restore packadges
- `dnu commands install Microsoft.Dnx.Watcher` - Install Dnx.Watcher






