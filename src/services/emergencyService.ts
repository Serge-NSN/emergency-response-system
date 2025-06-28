import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  doc, 
  updateDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { EmergencyReport, EmergencyStatus } from '../types';

export interface CreateEmergencyReportData {
  type: string;
  priority: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  phone?: string;
  images?: File[];
}

export interface EmergencyReportWithId extends Omit<EmergencyReport, 'id'> {
  id: string;
}

// Test Firebase Storage connection
export const testStorageConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Firebase Storage connection...');
    const testRef = ref(storage, 'test-connection.txt');
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    await uploadBytes(testRef, testBlob);
    console.log('Firebase Storage connection successful');
    return true;
  } catch (error) {
    console.error('Firebase Storage connection failed:', error);
    return false;
  }
};

// Test general connectivity and Firebase services
export const testConnectivity = async (): Promise<{
  internet: boolean;
  firestore: boolean;
  storage: boolean;
}> => {
  const results = {
    internet: false,
    firestore: false,
    storage: false
  };

  try {
    // Test basic internet connectivity
    const internetTest = await fetch('https://www.google.com', { 
      method: 'HEAD',
      mode: 'no-cors'
    });
    results.internet = true;
    console.log('Internet connectivity: OK');
  } catch (error) {
    console.log('Internet connectivity: FAILED');
  }

  try {
    // Test Firestore connectivity
    const firestoreTest = await getDocs(collection(db, 'emergencies'));
    results.firestore = true;
    console.log('Firestore connectivity: OK');
  } catch (error) {
    console.log('Firestore connectivity: FAILED');
  }

  try {
    // Test Storage connectivity
    const storageTest = await testStorageConnection();
    results.storage = storageTest;
    console.log('Storage connectivity:', storageTest ? 'OK' : 'FAILED');
  } catch (error) {
    console.log('Storage connectivity: FAILED');
  }

  return results;
};

// Save emergency report to Firestore
export const createEmergencyReport = async (
  reportData: CreateEmergencyReportData,
  userId: string,
  userName: string
): Promise<string> => {
  try {
    console.log('Creating emergency report:', { reportData, userId, userName });
    
    // Upload images to Firebase Storage if any
    const imageUrls: string[] = [];
    if (reportData.images && reportData.images.length > 0) {
      console.log(`Uploading ${reportData.images.length} images...`);
      
      // Test storage connection first with shorter timeout
      try {
        const storageWorking = await Promise.race([
          testStorageConnection(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Storage test timeout')), 5000))
        ]);
        if (!storageWorking) {
          console.warn('Storage connection failed, proceeding without images');
        }
      } catch (storageTestError) {
        console.warn('Storage test failed, proceeding without images:', storageTestError);
      }
      
      for (let i = 0; i < reportData.images.length; i++) {
        const image = reportData.images[i];
        try {
          console.log(`Uploading image ${i + 1}/${reportData.images.length}: ${image.name} (${image.size} bytes)`);
          
          // Validate image file
          if (image.size === 0) {
            console.warn(`Image ${i + 1} is empty, skipping`);
            continue;
          }
          
          if (image.size > 5 * 1024 * 1024) { // Reduced to 5MB limit for faster uploads
            console.warn(`Image ${i + 1} is too large (${image.size} bytes), skipping`);
            continue;
          }
          
          // Create a unique filename
          const timestamp = Date.now();
          const uniqueName = `${timestamp}-${i}-${image.name}`;
          const imageRef = ref(storage, `emergency-images/${uniqueName}`);
          
          // Upload the image with timeout
          const uploadPromise = uploadBytes(imageRef, image);
          const uploadWithTimeout = Promise.race([
            uploadPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Image upload timeout')), 10000))
          ]);
          
          const snapshot = await uploadWithTimeout as any;
          console.log(`Image ${i + 1} uploaded successfully`);
          
          // Get the download URL with timeout
          const downloadPromise = getDownloadURL(snapshot.ref);
          const downloadWithTimeout = Promise.race([
            downloadPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Download URL timeout')), 5000))
          ]);
          
          const downloadURL = await downloadWithTimeout as string;
          imageUrls.push(downloadURL);
          console.log(`Image ${i + 1} download URL:`, downloadURL);
          
        } catch (imageError) {
          console.error(`Failed to upload image ${i + 1}:`, imageError);
          // Continue with other images instead of failing completely
        }
      }
      
      console.log(`Successfully uploaded ${imageUrls.length}/${reportData.images.length} images`);
    }

    // Create the emergency report document with timeout
    const emergencyData = {
      type: reportData.type,
      priority: reportData.priority,
      status: EmergencyStatus.REPORTED,
      title: reportData.title,
      description: reportData.description,
      location: reportData.location,
      reporter: {
        id: userId,
        name: userName,
        phone: reportData.phone
      },
      images: imageUrls,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notes: []
    };

    console.log('Saving emergency data to Firestore:', emergencyData);
    
    // Add timeout to Firestore operation
    const firestorePromise = addDoc(collection(db, 'emergencies'), emergencyData);
    const firestoreWithTimeout = Promise.race([
      firestorePromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 15000))
    ]);
    
    const docRef = await firestoreWithTimeout as any;
    console.log('Emergency report created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating emergency report:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to create emergency report: ${error.message}`);
    }
    throw new Error('Failed to create emergency report');
  }
};

// Get all emergency reports
export const getEmergencyReports = async (): Promise<EmergencyReportWithId[]> => {
  try {
    console.log('Fetching emergency reports from Firestore...');
    const q = query(
      collection(db, 'emergencies'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.size} emergency reports`);
    
    const reports: EmergencyReportWithId[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Emergency report data:', { id: doc.id, ...data });
      reports.push({
        id: doc.id,
        type: data.type,
        priority: data.priority,
        status: data.status,
        title: data.title,
        description: data.description,
        location: data.location,
        reporter: data.reporter,
        images: data.images || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        acknowledgedBy: data.acknowledgedBy,
        resolvedBy: data.resolvedBy,
        resolvedAt: data.resolvedAt?.toDate(),
        notes: data.notes || []
      });
    });
    
    console.log('Processed emergency reports:', reports);
    return reports;
  } catch (error) {
    console.error('Error fetching emergency reports:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch emergency reports: ${error.message}`);
    }
    throw new Error('Failed to fetch emergency reports');
  }
};

// Get emergency reports by status
export const getEmergencyReportsByStatus = async (status: EmergencyStatus): Promise<EmergencyReportWithId[]> => {
  try {
    const q = query(
      collection(db, 'emergencies'),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const reports: EmergencyReportWithId[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reports.push({
        id: doc.id,
        type: data.type,
        priority: data.priority,
        status: data.status,
        title: data.title,
        description: data.description,
        location: data.location,
        reporter: data.reporter,
        images: data.images || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        acknowledgedBy: data.acknowledgedBy,
        resolvedBy: data.resolvedBy,
        resolvedAt: data.resolvedAt?.toDate(),
        notes: data.notes || []
      });
    });
    
    return reports;
  } catch (error) {
    console.error('Error fetching emergency reports by status:', error);
    throw new Error('Failed to fetch emergency reports');
  }
};

// Update emergency report status
export const updateEmergencyStatus = async (
  emergencyId: string,
  status: EmergencyStatus,
  userId?: string,
  notes?: string
): Promise<void> => {
  try {
    const emergencyRef = doc(db, 'emergencies', emergencyId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    };

    if (status === EmergencyStatus.ACKNOWLEDGED && userId) {
      updateData.acknowledgedBy = userId;
    }

    if (status === EmergencyStatus.RESOLVED && userId) {
      updateData.resolvedBy = userId;
      updateData.resolvedAt = serverTimestamp();
    }

    if (notes) {
      updateData.notes = [...(updateData.notes || []), {
        text: notes,
        userId,
        timestamp: serverTimestamp()
      }];
    }

    await updateDoc(emergencyRef, updateData);
  } catch (error) {
    console.error('Error updating emergency status:', error);
    throw new Error('Failed to update emergency status');
  }
}; 