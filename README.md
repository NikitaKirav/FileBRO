# FileBrowse
Hello everybody! When you use the **CKEditor** with **ASP.NET Core** you might have seen that the file manager **CKFinder** didn't work . I'd like to present my FileBrowser!

![screenshot of FileBrowse](http://kirav.ru/images/articles/51/file-browser-screenshort04.jpg)

I do like CKEditor and I didn't want to change it to another one. For my **"FileBrowser"** I have made the simplified version of the CKFinder. It's easier but its main functions are still available. 

You can use my FileBrowse in your projects!

FileBrowser has the following opportunities :

1. Upload files.
2. Choose file (the selected file goes to the URL field of the CKEditor) 
3. Copy files.
4. Move files.
5. Rename files.
6. Delete files.
7. Add folders.
8. Rename folders.
9. Delete folders.

My repository consists of two branches:

* `master` - for  users. 
* `development` - if you want to change something in my FileBrowser.

In my project I use **ASP.NET Core 3.1**. *For using the FileBrowser in your project simply copy all files from the branch `master` to your "Solution".* Of course, you have to change the namespace in `ImageController` to your one. Also your CKEditor must have a plugin `image`.
***
**The main notes:**

The `ImageController.cs` has the field called `mainDirectory`. This is the initial directory of the FileBrowser. It has to exist in your file system. The field is initialized in the constructor. You have to change it to your one. In the future the user can't delete or change this folder. 
***
**For developers:**

The project consists of the following files:

     'package.json', 'package-lock.json', 'webpack.config.js' - these files are the Webpack.
     
     /Scripts/Component/ - there are components of the FileBrowser. All components are javascript files.
     
     /Scripts/images/ - there are `.svg` icons.
     
     /Scripts/Styles/ - there is a stylesheet file `.less`.
     
     'main.js' is the initial javascript file.

***
***I hope FileBrowser will be useful for you!***
