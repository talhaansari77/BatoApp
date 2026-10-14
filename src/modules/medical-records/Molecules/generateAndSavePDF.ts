import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';


export const generateAndSavePDF = async (htmlContent: string) => {

    try {
      // 1. Generate PDF file in cache directory
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log('PDF generated at:', uri);

      // 2. Handle saving / sharing based on platform
      if (Platform.OS === 'ios') {
        // iOS: Opens the native share/save sheet (allows saving to "Files" app)
        await Sharing.shareAsync(uri, {
           UTI: '.pdf',
           mimeType: 'application/pdf',
        });
      } else {
        // Android: Request media/storage permissions and save or share
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (permission.granted) {
          await MediaLibrary.createAssetAsync(uri);
          alert('PDF saved to your device gallery/storage!');
        } else {
          // Fallback to sharing dialog if permission is denied
          await Sharing.shareAsync(uri);
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };