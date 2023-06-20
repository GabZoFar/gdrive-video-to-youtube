# drive-video-to-youtube
 Automatically upload Google Drive videos to YouTube after a delay (hours, days, months...).
 1. Recursively searches in your sub folders
 2. Can upload as Public, Private (I would avoid unlisted as it will be sunsetted soon)
 3. Check for duplicates (see Google sheet setup)

## **Video Upload Script Documentation**

This script automates the process of uploading videos from a Google Drive folder to YouTube. It allows you to specify a target folder in Google Drive and uploads videos that are older than 30 days and of specific allowed video types. The script also ensures that duplicate videos are not uploaded by keeping track of the uploaded video IDs in a Google Sheet.

### **Prerequisites**

- Google Drive API enabled
- YouTube Data API enabled
- Google Sheets API enabled

### **Setup**

1. Open the Apps Script editor in your Google Sheets document.
2. Create a new script file or edit an existing one.
3. Copy and paste the provided script into the script editor.
4. Customize the configuration settings in the script according to your requirements:
    - Replace **`'folder_id'`** in the **`folderId`** variable with the ID of your target folder in Google Drive.
    - Replace **`'sheet_id'`** in the **`sheetId`** variable with the ID of your Google Sheets document where you want to store the uploaded video IDs.
    - Customize the recipient email address in the **`recipient`** variable for the notification email.
5. Save the script and give it an appropriate name.
6. Run the **`uploadVideosToYouTube`** function to start the video uploading process.

### **Functions**

The script contains the following functions:

### **`uploadVideosToYouTube()`**

This is the main function that orchestrates the video uploading process. It retrieves videos from the target folder, filters out the eligible videos, and uploads them to YouTube. It also sends a notification email with the uploaded video links or a custom message.

### **`getVideosInFolder(folderId)`**

This function retrieves all the videos in the specified folder using a recursive approach. It takes the **`folderId`** as input and returns an array of video files.

### **`getFilesRecursive(folder, files)`**

This function is a helper function used by **`getVideosInFolder()`**. It recursively traverses through the subfolders of a given folder and adds video files to the **`files`** array.

### **`isAllowedVideoType(mimeType)`**

This function checks if a given video MIME type is allowed for uploading. It takes the **`mimeType`** as input and returns a boolean value indicating whether the video type is allowed or not.

### **`getUploadedVideos()`**

This function retrieves the list of previously uploaded video IDs from a Google Sheet. It reads the video IDs from the specified sheet and returns an array of video IDs.

### **`addUploadedVideo(videoId)`**

This function adds an uploaded video ID to the Google Sheet to keep track of the uploaded videos. It takes the **`videoId`** as input and appends it to the specified sheet.

### **Logging**

The script uses **`Logger.log()`** statements to log information and status messages during the execution. The logs can be viewed in the Apps Script editor under "View" > "Logs" or by pressing **`Ctrl + Enter`**.

### **Error Handling**

The script uses try-catch blocks to handle errors that may occur during the video uploading process. If an error occurs while uploading a video, the script logs the error message and continues with the next video.

### **Google Sheets Integration**

The script integrates with Google Sheets to store and retrieve the uploaded video IDs. The video IDs are stored in a specified sheet, allowing the script to check for duplicate uploads.

### **Notifications**

After the video uploading process is complete, the script sends a notification email to the specified recipient. The email subject and body are customized based on the results of the upload process.

That's the documentation for the provided script. Make sure to review and customize the configuration settings and prerequisites before running the script.

Thanks ChatGPT
