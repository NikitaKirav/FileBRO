using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KiravRu.Controllers
{
    [Route("image")]
    public class ImageController : Controller
    {
        private IWebHostEnvironment _hostingEnvironment;
        // The beginning directory. This directory user can't delete or change 
        private string mainDirectory;

        public ImageController(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
            mainDirectory = Path.Combine(Directory.GetCurrentDirectory(), _hostingEnvironment.WebRootPath, "images", "articles");
    }
        public IActionResult Index()
        {
            return View();
        }

        [Route("upload_ckeditor")]
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UploadCKEditor(IFormFile upload, string CKEditorFuncNum) //, string CKEditor, string langCode)
        {
            string vImagePath = String.Empty;
            string vMessage = String.Empty;
            string vFilePath = String.Empty;
            string vOutput = String.Empty;

            try
            {
                var vFileName = DateTime.Now.ToString("yyyyMMddHHmmss") + upload.FileName;
                var vFolderPath = mainDirectory;
                if (!Directory.Exists(vFolderPath))
                {
                    Directory.CreateDirectory(vFolderPath);
                }
                vFilePath = Path.Combine(vFolderPath, vFileName);
                using (FileStream stream = new FileStream(vFilePath, FileMode.Create))
                {
                    await upload.CopyToAsync(stream);
                }
                vImagePath = Url.Content("/images/articles/" + vFileName);
                vMessage = "The file uploaded successfully.";
            }
            catch (Exception e)
            {
                vMessage = "There was an issue uploading:" + e.Message;
            }
            vOutput = @"<html><body><script>window.parent.CKEDITOR.tools.callFunction(" + CKEditorFuncNum + ", \"" + vImagePath + "\", \"" + vMessage + "\");</script></body></html>";
            return Content(vOutput, "text/html");
        }

        [Route("uploadfile")]
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UploadFile(IFormFile upload, string dir)
        {
            try
            {
                var vFileName = DateTime.Now.ToString("yyyyMMddHHmmss") + upload.FileName;
                if (!Directory.Exists(dir))
                {
                    Directory.CreateDirectory(dir);
                }
                string vFilePath = Path.Combine(dir, vFileName);

                using (FileStream stream = new FileStream(vFilePath, FileMode.Create))
                {
                    await upload.CopyToAsync(stream);
                }
            }
            catch (Exception e)
            {
                return Ok(new { error = "There was an issue uploading:" + e.Message });
            }
            return Ok(new { error = "" });
        }

        [Route("filebrowse")]
        [HttpGet]
        [Authorize(Roles = "admin")]
        public IActionResult FileBrowse()
        {
            var dir = new DirectoryInfo(mainDirectory);
            var directoryList = new List<DirectoryImage>();
            directoryList.Add(new DirectoryImage
            {
                Id = 0,
                Name = dir.Name,
                FullName = dir.FullName,
                Parent = dir.Parent.FullName,
                IsFoldersInside = (new DirectoryInfo(dir.FullName)).GetDirectories() != null ? true : false,
                Level = 0
            });
            ViewBag.dirInfos = directoryList;
            return View("FileBrowse");
        }

        [Route("getdirectory")]
        [HttpGet]
        [Authorize(Roles = "admin")]
        public IActionResult GetDirectory(string dir)
        {
            if ((dir == null) || (!Directory.Exists(dir))) { return BadRequest(); }
            var directoryList = new List<DirectoryImage>();
            var dirInfo = new DirectoryInfo(dir);
            var directories = dirInfo.GetDirectories();
            foreach (var directory in directories)
            {
                directoryList.Add(new DirectoryImage
                {
                    Name = directory.Name,
                    FullName = directory.FullName,
                    Parent = directory.Parent.FullName
                });
            }
            return Ok(directoryList);
        }

        [Route("getfiles")]
        [HttpGet]
        [Authorize(Roles = "admin")]
        public IActionResult GetFiles(string dir)
        {
            if ((dir == null) || (!Directory.Exists(dir))) { return BadRequest(); }
            var filesList = new List<FileImage>();
            var dirInfo = new DirectoryInfo(dir);
            var files = dirInfo.GetFiles();
            foreach (var file in files)
            {
                filesList.Add(new FileImage
                {
                    Name = file.Name,
                    FullName = Regex.Match(file.FullName, "wwwroot(.*)").Groups[1].Value,
                    LastWriteTime = file.LastWriteTime.ToString("yyyy.MM.dd HH:mm"),
                    DirectoryName = file.DirectoryName,
                    Length = file.Length,
                    Extension = file.Extension
                });
            }
            return Ok(filesList);
        }

        [Route("addnewfolder")]
        [HttpGet]
        [Authorize(Roles = "admin")]
        public IActionResult AddNewFolder(string dir, string name)
        {
            if (dir == null || name == null) { return Ok(new { error = "Error in the request! Try again..." }); }
            string newPath = Path.Combine(dir, name);

            if (Directory.Exists(newPath)) { return Ok(new { error = "This folder name is in the directory. Rename the new folder!" }); }

            var directory = Directory.CreateDirectory(newPath);

            return Ok(new { error = "" });
        }

        [Route("renamefolder")]
        [HttpGet]
        [Authorize(Roles = "admin")]
        public IActionResult RenameFolder(string dir, string name)
        {
            if (dir == null || name == null) { return Ok(new { error = "Error in the request! Try again..." }); }
            if (dir == mainDirectory) { return Ok(new { error = "You can't change or delete the beginning directory!" }); }
            string newPath = Path.Combine(Directory.GetParent(dir).ToString(), name);

            if(Directory.Exists(newPath)) { return Ok(new { error = "This folder name is in the directory. Rename the new folder!" }); }

            DirectoryInfo dirInfo = new DirectoryInfo(dir);
            if (dirInfo.Exists && Directory.Exists(newPath) == false)
            {
                dirInfo.MoveTo(newPath);
            }
            return Ok(new { dir = newPath, error = "" });
        }

        [Route("remotefolder")]
        [HttpGet]
        [Authorize(Roles = "admin")]
        public IActionResult RemoteFolder(string dir)
        {
            if (dir == null) { return Ok(new { error = "Error in the request! Try again..." }); }
            if (dir == mainDirectory) { return Ok(new { error = "You can't change or delete the beginning directory!" }); }
            if (!Directory.Exists(dir)) { return Ok(new { error = "This folder isn't in the directory." }); }

            Directory.Delete(dir, true);

            return Ok(new { error = "" });
        }

        [Route("renamefile")]
        [HttpGet]
        [Authorize(Roles = "admin")]
        public IActionResult RenameFile(string dir, string nameOld, string nameNew)
        {
            if (dir == null || nameOld == null || nameNew == null) { return Ok(new { error = "Error in the request! Try again..." }); }
            string oldPath = Path.Combine(dir, nameOld);
            string newPath = Path.Combine(dir, nameNew);
            if (!System.IO.File.Exists(oldPath)) { return Ok(new { error = "The file to rename don't exist in the folder!" }); }
            if (System.IO.File.Exists(newPath)) { return Ok(new { error = "This file name is in the folder. Rename the file!" }); }

            System.IO.File.Move(oldPath, newPath);

            return Ok(new { error = "" });
        }

        [Route("movefiles")]
        [HttpPost]
        [Authorize(Roles = "admin")]
        public IActionResult MoveFiles([FromBody] DirectoriesList value, string newDir)
        {
            if ((value == null) || (newDir == null)) { return Ok(new { error = "Error in the request! Try again..." }); }
            // It checks exist of files in folders
            string errorMessage = CheckExistFilesAndDirectories(value.names, value.dir, newDir);
            if (!String.IsNullOrEmpty(errorMessage)) { return Ok(new { error = errorMessage }); }
            // If it's Ok, it copies files in the folder
            foreach (var file in value.names)
            {
                string pathOld = Path.Combine(value.dir, file);
                string pathNew = Path.Combine(newDir, file);
                System.IO.File.Move(pathOld, pathNew);
            }

            return Ok(new { error = "" });
        }

        [Route("copyfiles")]
        [HttpPost]
        [Authorize(Roles = "admin")]
        public IActionResult CopyFiles([FromBody] DirectoriesList value, string newDir)
        {
            if ((value == null) || (newDir == null)) { return Ok(new { error = "Error in the request! Try again..." }); }
            // It checks exist of files in folders
            string errorMessage = CheckExistFilesAndDirectories(value.names, value.dir, newDir);
            if (!String.IsNullOrEmpty(errorMessage)) {  return Ok(new { error = errorMessage });  }
            // If it's Ok, it copies files in the folder
            foreach (var file in value.names)
            {
                string pathOld = Path.Combine(value.dir, file);
                string pathNew = Path.Combine(newDir, file);
                System.IO.File.Copy(pathOld, pathNew, true);
            }

            return Ok(new { error = "" });
        }

        [Route("remotefiles")]
        [HttpPost]
        [Authorize(Roles = "admin")]
        public IActionResult RemoteFiles([FromBody] DirectoriesList value)
        {
            if (value == null) { return Ok(new { error = "Error in the request! Try again..." }); }
            // It checks exist of files in folders
            string errorMessage = CheckExistFilesAndDirectories(value.names, value.dir);
            if (!String.IsNullOrEmpty(errorMessage)) { return Ok(new { error = errorMessage }); }
            // If it's Ok, it copies files in the folder
            foreach (var file in value.names)
            {
                string path = Path.Combine(value.dir, file);
                System.IO.File.Delete(path);
            }

            return Ok(new { error = "" });
        }

        /// <summary>
        /// It checks exist files in folders
        /// </summary>
        /// <param name="names">The list of files names</param>
        /// <param name="oldDir">The directory where ley these files</param>
        /// <param name="newDir">The directory where you copy or move these files</param>
        /// <returns>Errors</returns>
        private string CheckExistFilesAndDirectories(List<string> names, string oldDir, string newDir = null)
        {            
            string errorMessage = String.Empty;
            DirectoriesList newFilesError = new DirectoriesList();
            DirectoriesList oldFilesError = new DirectoriesList();
            newFilesError.names = new List<string>();
            oldFilesError.names = new List<string>();
            if (!String.IsNullOrEmpty(oldDir))
            {
                oldFilesError.dir = new DirectoryInfo(oldDir).Name;
                if (!Directory.Exists(oldDir)) { return "The directory " + oldFilesError.dir + " don't exist!"; }
            }
            if (!String.IsNullOrEmpty(newDir))
            {                
                newFilesError.dir = new DirectoryInfo(newDir).Name;
                if (!Directory.Exists(newDir)) { return "The directory " + newFilesError.dir + " don't exist!"; }
            }
            foreach (var file in names)
            {
                if (!String.IsNullOrEmpty(oldDir)) 
                {
                    string pathOld = Path.Combine(oldDir, file);
                    if (!System.IO.File.Exists(pathOld)) { oldFilesError.names.Add(file); }
                }
                if (!String.IsNullOrEmpty(newDir))
                {
                    string pathNew = Path.Combine(newDir, file);
                    if (System.IO.File.Exists(pathNew)) { newFilesError.names.Add(file); }
                }
            }
            if (!String.IsNullOrEmpty(oldDir))
            {
                errorMessage += WriteErrors(oldFilesError, errorMessage, "The follow files don't exist in the folder ");
            }
            if (!String.IsNullOrEmpty(newDir))
            {
                errorMessage += WriteErrors(newFilesError, errorMessage, "The follow files already exist in the folder ");
            }
            return errorMessage;
        }

        private string WriteErrors(DirectoriesList filesError, string errorMessage, string textMessage)
        {
            if ((filesError.names != null) && (filesError.names.Count > 0))
            {
                errorMessage = textMessage + filesError.dir + ": ";
                for (var i = 0; i < filesError.names.Count; i++)
                {
                    errorMessage += filesError.names[0];
                    if ((i + 1) < filesError.names.Count)
                    { errorMessage += ", "; }
                    else
                    { errorMessage += ". "; }
                }
            }
            return errorMessage;
        }

    }

    public class DirectoriesList
    {
        public List<string> names { get; set; }
        public string dir { get; set; }
    }

    public class DirectoryImage
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string FullName { get; set; }
        public string Parent { get; set; }
        public bool IsFoldersInside { get; set; }
        public int Level { get; set; }
    }

    public class FileImage
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string FullName { get; set; }
        public string LastWriteTime { get; set; }
        public string DirectoryName { get; set; }
        public long Length { get; set; }
        public string Extension { get; set; }
    }
}