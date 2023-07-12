const admin = require('firebase-admin');
admin.initializeApp();

// Retrieve document from source collection
const sourceCollection = admin.firestore().collection('sourceCollection');
const documentId = 'your-document-id';

sourceCollection
  .doc(documentId)
  .get()
  .then((snapshot) => {
    if (snapshot.exists) {
      // Get the document data
      const documentData = snapshot.data();

      // Transform the data if needed
      const transformedData = {
        // Modify the document fields as required
        field1: documentData.field1,
        field2: documentData.field2,
        // Add or remove fields as needed
      };

      // Write the transformed data to the destination collection
      const destinationCollection = admin.firestore().collection('destinationCollection');
      destinationCollection.doc(documentId).set(transformedData)
        .then(() => {
          console.log('Data successfully converted and written to destination collection.');
        })
        .catch((error) => {
          console.error('Error writing to destination collection:', error);
        });
    } else {
      console.log('Document does not exist.');
    }
  })
  .catch((error) => {
    console.error('Error retrieving document:', error);
  });