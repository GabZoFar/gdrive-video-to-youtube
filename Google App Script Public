function uploadVideosToYouTube() {
  Logger.log('Starting uploadVideosToYouTube...');
  var folderId = 'Folder_ID'; // Replace with the ID of the target folder
  var videos = getVideosInFolder(folderId);
  var videoLinks = [];
  var videosFound = false; // Flag to track if any eligible videos are found

  var uploadedVideos = getUploadedVideos(); // Get the list of previously uploaded video IDs

  for (var i = 0; i < videos.length; i++) {
    var video = videos[i];
    var createdTime = video.getDateCreated();
    var currentDate = new Date();
    var timeDiff = currentDate.getTime() - createdTime.getTime();
    var diffInDays = timeDiff / (1000 * 3600 * 24);
    var videoType = video.getMimeType();

    // Check if the video is more than 30 days old, of an allowed video type, and not already uploaded
    if (diffInDays > 30 && isAllowedVideoType(videoType) && !isVideoUploaded(video.getId(), uploadedVideos)) { // change 30 to edit the number of days
      // Check if the videoType starts with 'video/'
      if (videoType.startsWith('video/')) {
        var metadata = {
          snippet: {
            title: video.getName(),
            description: 'Uploaded from Google Drive',
            tags: ['Google Drive', 'Automation'],
          },
          status: {
            privacyStatus: 'private',
          },
        };

        try {
          Logger.log('Uploading video: ' + video.getName());
          var response = YouTube.Videos.insert(metadata, 'snippet,status', video.getBlob());
          Logger.log('Video uploaded: ' + response.id);
          var videoLink = 'https://www.youtube.com/watch?v=' + response.id;
          videoLinks.push(videoLink);
          videosFound = true;

          // Add the uploaded video ID to the list of uploaded videos
          addUploadedVideo(video.getId());
        } catch (e) {
          Logger.log('Error uploading video: ' + JSON.stringify(e));
          continue; // Skip to the next iteration of the loop
        }
      } else {
        Logger.log('Video format not supported: ' + video.getName());
      }
    } else {
      Logger.log('Video not eligible for upload: ' + video.getName());
    }
  }

  // Send a notification email with the video links or custom message when the script is complete
  var recipient = 'email@email.com'; // Replace with your email address
  var subject = '';
  var body = '';
  if (videosFound) {
    subject = 'Video upload complete'; // Edit the subject of success email
    body =
      'All videos older than 30 days from the specified folder in the shared drive have been uploaded to YouTube. Here are the links to the videos:\n\n';
    for (var i = 0; i < videoLinks.length; i++) {
      body += videoLinks[i] + '\n';
    }
  } else {
    subject = 'No videos to upload this month :D'; // Edit the subject of your negative case email
    body =
      'No eligible videos older than 30 days found in the specified folder of the shared drive for uploading to YouTube.';
  }
  Logger.log('Sending notification email...');
  GmailApp.sendEmail(recipient, subject, body);
  Logger.log('Notification email sent.');
}

function getVideosInFolder(folderId) {
  Logger.log('Starting getVideosInFolder...');
  var folder = DriveApp.getFolderById(folderId);
  var videos = [];
  getFilesRecursive(folder, videos);
  Logger.log('Found ' + videos.length + ' videos in the folder.');
  return videos;
}

function getFilesRecursive(folder, files) {
  var videoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo']; // Updated video types
  videoTypes.forEach(function (type) {
    var folderFiles = folder.getFilesByType(type);
    while (folderFiles.hasNext()) {
      var file = folderFiles.next();
      Logger.log('Found video: ' + file.getName());
      files.push(file);
    }
  });

  var subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    var subfolder = subfolders.next();
    getFilesRecursive(subfolder, files);
  }
}

function isAllowedVideoType(mimeType) {
  var allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo']; // Updated video types
  return allowedVideoTypes.includes(mimeType);
}

function getUploadedVideos() {
  var sheetId = 'Google_Sheet_ID'; // Replace with the ID of your Google Sheets document
  var sheetName = 'Sheet_ID'; // Replace with the name of the sheet where you store the video IDs
  Logger.log('Retrieving uploaded video IDs from Google Sheets...');
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  var videoIds = [];

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var videoId = row[0]; // Assuming the video ID is in the first column (A)
    videoIds.push(videoId);
  }

  Logger.log('Retrieved ' + videoIds.length + ' uploaded video IDs from Google Sheets.');
  return videoIds;
}

function addUploadedVideo(videoId) {
  var sheetId = 'Google_Sheet_ID'; // Replace with the ID of your Google Sheets document
  var sheetName = 'Sheet_ID'; // Replace with the name of the sheet where you store the video IDs
  Logger.log('Adding uploaded video ID to Google Sheets: ' + videoId);
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  sheet.appendRow([videoId]);
  Logger.log('Uploaded video ID added to Google Sheets.');
}

function isVideoUploaded(videoId, uploadedVideos) {
  Logger.log('Checking if video is already uploaded: ' + videoId);
  return uploadedVideos.includes(videoId);
}
