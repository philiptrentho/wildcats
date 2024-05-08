import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore, auth } from "../../utilities/firebase";

const PictureUploader = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const userId = auth.currentUser.uid;

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (imageFile) {
      const storage = getStorage();
      const storageRef = ref(storage, 'profilePictures/' + imageFile.name);

      try {
        // Upload image to Firebase Storage
        const snapshot = await uploadBytes(storageRef, imageFile);
        console.log('Image uploaded successfully:', snapshot);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Download URL:', downloadURL);

        // Update the profilePicture field of the user document
        await updateUserField(userId, 'profilePicture', downloadURL);

        console.log('Profile picture URL saved to Firestore:', downloadURL);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      console.error('No image selected.');
    }
  };

  const updateUserField = async (userId, fieldName, fieldValue) => {
    const userDocRef = doc(firestore, `users/${userId}`);

    try {
      await setDoc(userDocRef, {
        [fieldName]: fieldValue
      }, { merge: true });

      console.log(`Field '${fieldName}' of user with ID '${userId}' updated successfully.`);
    } catch (error) {
      console.error(`Error updating field '${fieldName}' of user with ID '${userId}':`, error);
    }
  };

  return (
    <div>
      <div>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Selected Image"
            style={{ maxWidth: '100%', maxHeight: '200px' }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }}
          id="imageUploadInput"
        />
        <label htmlFor="imageUploadInput">
          <img
            src="placeholder-image-url"
            alt="Upload Image"
            onClick={() => document.getElementById('imageUploadInput').click()}
            style={{ cursor: 'pointer' }}
          />
        </label>
        <button onClick={handleImageUpload}>Upload Image</button>
      </div>
    </div>
  );
};

export default PictureUploader;
