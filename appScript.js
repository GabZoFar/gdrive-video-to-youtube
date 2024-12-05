function uploadVideosToYouTube() {
  Logger.log('Starting uploadVideosToYouTube...');
  // Define folders and their corresponding email recipients
  var folderConfig = [
    {
      folderId: 'folder_id',
      recipient: 'email@example.com'
    },
    {
      folderId: 'folder_id',
      recipient: 'email@example.com'
    }
  ];
  
  // Track uploads for each folder separately
  var folderUploads = {};
  var uploadedVideos = getUploadedVideos();

  // Initialize tracking for each folder
  folderConfig.forEach(function(config) {
    folderUploads[config.folderId] = {
      videoLinks: [],
      videosFound: false
    };
  });

  // Process each folder
  for (var folderIndex = 0; folderIndex < folderConfig.length; folderIndex++) {
    var currentFolder = folderConfig[folderIndex];
    var videos = getVideosInFolder(currentFolder.folderId);
    
    for (var i = 0; i < videos.length; i++) {
      var video = videos[i];
      var createdTime = video.getDateCreated();
      var currentDate = new Date();
      var timeDiff = currentDate.getTime() - createdTime.getTime();
      var diffInDays = timeDiff / (1000 * 3600 * 24);
      var videoType = video.getMimeType();

      if (diffInDays > 30 && isAllowedVideoType(videoType) && !isVideoUploaded(video.getId(), uploadedVideos)) {
        if (videoType.startsWith('video/')) {
          var metadata = {
            snippet: {
              title: video.getName(),
              description: 'Uploaded from Google Drive',
              tags: ['Google Drive', 'Automation'], // Add your tags here
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
            folderUploads[currentFolder.folderId].videoLinks.push(videoLink);
            folderUploads[currentFolder.folderId].videosFound = true;
            addUploadedVideo(video.getId());
          } catch (e) {
            Logger.log('Error uploading video: ' + JSON.stringify(e));
            continue;
          }
        } else {
          Logger.log('Video format not supported: ' + video.getName());
        }
      } else {
        Logger.log('Video not eligible for upload: ' + video.getName());
      }
    }

    // Send email for this folder's uploads
    var subject = '';
    var body = '';
    if (folderUploads[currentFolder.folderId].videosFound) {
      subject = 'Video upload complete';
      body = 'All videos older than 30 days from your designated folder have been uploaded to YouTube. Here are the links to the videos:\n\n';
      folderUploads[currentFolder.folderId].videoLinks.forEach(function(link) {
        body += link + '\n';
      });
    } else {
      subject = 'No videos to upload this month :D';
      body = 'No eligible videos older than 30 days found in your designated folder for uploading to YouTube.';
    }
    
    Logger.log('Sending notification email to ' + currentFolder.recipient);
    GmailApp.sendEmail(currentFolder.recipient, subject, body);
    Logger.log('Notification email sent to ' + currentFolder.recipient);
  }
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
  var sheetId = 'google_sheet_id'; // Replace with the ID of your Google Sheets document
  var sheetName = 'UploadedVideos'; // Replace with the name of the sheet where you store the video IDs
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
  var sheetId = 'google_sheet_id'; // ID of your Google Sheets document
  var sheetName = 'UploadedVideos'; // Name of the sheet where you store the video IDs
  Logger.log('Adding uploaded video ID to Google Sheets: ' + videoId);
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  sheet.appendRow([videoId]);
  Logger.log('Uploaded video ID added to Google Sheets.');
}

function isVideoUploaded(videoId, uploadedVideos) {
  Logger.log('Checking if video is already uploaded: ' + videoId);
  return uploadedVideos.includes(videoId);
}
