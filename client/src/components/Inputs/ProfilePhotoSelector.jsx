import { useEffect, useRef, useState } from 'react';
import { LuTrash2, LuUpload, LuUser } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

    // validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    // update image state
    setImage(file);
  };

  // Open file picker
  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  // remove selected image
  const handleRemoveImage = () => {
    setImage(null);

    // reset input so the same image can be selected again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex justify-center mb-6">
      {/* hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
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
    </div>
  );
};

export default ProfilePhotoSelector;
