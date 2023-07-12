const config = {
  target: '#uppyHolder',
  endpoint: 'fakeServer',
  DashboardInline: true,
  Webcam: true,
  GoogleDrive: true,
  Dropbox: true,
  Instagram: true,
  autoProceed: false,
  restrictions: {
    maxFileSize: 1000000,
    maxNumberOfFiles: 3,
    minNumberOfFiles: 2,
    allowedFileTypes: ['images/*', 'video/*']
  },
  metaFields: [
    {
      id: 'resizeTo',
      name: 'Resize to',
      value: 1200,
      placeholder: 'specify future images size'
    },
    {
      id: 'description',
      name: 'Description',
      value: 'none',
      placeholder: 'describe what the file is for'
    }
  ]
};
export default config;
