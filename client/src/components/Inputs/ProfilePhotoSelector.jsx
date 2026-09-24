import { useEffect, useRef, useState } from 'react';
import { LuTrash2, LuUpload, LuUser } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formatError, setFormatError] = useState('');

  // create preview URL whenever image changes
  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    const preview = URL.createObjectURL(image);
    setPreviewUrl(preview);

    // cleanup old preview URL
    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [image]);

  // handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // allowed image formats check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setFormatError('Only JPG, JPEG, PNG, and WEBP formats are allowed!');

      // reset input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    // clear error and update state
    setFormatError('');
    setImage(file);
  };

  // Open file picker
  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  // remove selected image
  const handleRemoveImage = () => {
    setImage(null);
    setFormatError('');

    // reset input so the same image can be selected again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      {/* hidden file input with specific accept types */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg, image/png, image/jpg, image/webp"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* no image selected */}
      {!image ? (
        <div className="relative flex items-center justify-center w-20 h-20 bg-blue-100/50 rounded-full">
          <LuUser className="text-4xl text-primary" />

          <button
            type="button"
            onClick={handleChooseFile}
            aria-label="Upload profile photo"
            className="absolute -bottom-1 -right-1 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white cursor-pointer transition-transform hover:scale-105"
          >
            <LuUpload size={16} />
          </button>
        </div>
      ) : (
        /* image selected */
        <div className="relative">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
            />
          )}

          <button
            type="button"
            onClick={handleRemoveImage}
            aria-label="Remove profile photo"
            className="absolute -bottom-1 -right-1 flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white cursor-pointer transition-transform hover:scale-105 hover:bg-red-600"
          >
            <LuTrash2 size={16} />
          </button>
        </div>
      )}

      {/* format error message */}
      {formatError && (
        <p className="text-red-500 text-xs mt-2 font-medium">{formatError}</p>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
