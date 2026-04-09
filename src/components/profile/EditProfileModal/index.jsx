import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Dices, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserMoviesContext } from '@/context/UserMoviesContext';
import './styles.css';

const DICEBEAR_STYLES = [
    { id: 'adventurer', name: 'Adventurer' },
    { id: 'bottts', name: 'Robots' },
    { id: 'lorelei', name: 'Lorelei' },
    { id: 'fun-emoji', name: 'Emoji' },
    { id: 'micah', name: 'Micah' },
    { id: 'avataaars', name: 'Avatars' }
];

const EditProfileModal = ({ isOpen, onClose }) => {
    const { currentUser, updateUserProfile } = useAuth();
    const { syncToBackend } = useUserMoviesContext();

    // Make local copies of original state
    const originalName = currentUser?.displayName || '';
    
    // Attempt to parse out existing DiceBear stats if url matches, otherwise defaults
    const isDicebear = currentUser?.photoURL?.includes('api.dicebear.com');
    const defaultStyle = isDicebear ? currentUser.photoURL.split('/')[4] : 'lorelei';
    
    // Defensive parsing for the seed
    let defaultSeed = currentUser?.uid || 'VibeoUser';
    if (isDicebear) {
        try {
            const url = new URL(currentUser.photoURL);
            defaultSeed = url.searchParams.get('seed') || defaultSeed;
        } catch (e) {
            console.warn("Could not parse DiceBear URL", e);
        }
    }

    const [username, setUsername] = useState(originalName);
    const [avatarStyle, setAvatarStyle] = useState(defaultStyle);
    const [avatarSeed, setAvatarSeed] = useState(defaultSeed);
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const currentPreviewUrl = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${encodeURIComponent(avatarSeed)}`;

    const handleRandomize = () => {
        const randomSeed = Math.random().toString(36).substring(2, 7);
        setAvatarSeed(randomSeed);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateUserProfile(username, currentPreviewUrl);
            await syncToBackend(); 
            onClose();
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return createPortal(
        <div className="edit-profile-overlay" onClick={onClose}>
            <div className="edit-profile-modal" onClick={e => e.stopPropagation()}>
                <div className="edit-profile-header">
                    <h2>Edit Profile</h2>
                    <button className="close-btn" onClick={onClose} disabled={isSaving} aria-label="Close">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="edit-profile-content">
                    {/* Avatar Section */}
                    <div className="avatar-section">
                        <label className="section-label">Profile avatar</label>
                        
                        <div className="avatar-preview-display">
                            <img src={currentPreviewUrl} alt="Avatar Preview" className="avatar-preview" />
                        </div>
                        
                        <div className="avatar-controls-row">
                            <select 
                                value={avatarStyle} 
                                onChange={(e) => setAvatarStyle(e.target.value)}
                                className="styled-select"
                            >
                                {DICEBEAR_STYLES.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                )) }
                            </select>
                            <button type="button" className="dice-btn" onClick={handleRandomize} title="Randomize Avatar">
                                <Dices size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Username Section */}
                    <div className="username-section">
                        <label className="section-label" htmlFor="username">Display name</label>
                        <div className="input-wrapper">
                            <input 
                                id="username"
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                maxLength={30}
                                placeholder="Enter your display name"
                                required
                            />
                            <div className="input-footer">
                                <span className="char-count">{username.length} / 30</span>
                            </div>
                        </div>
                    </div>

                    <div className="edit-profile-actions">
                        <button type="submit" className="save-btn-primary" disabled={isSaving || !username.trim()}>
                            {isSaving ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                        <button type="button" className="cancel-link" onClick={onClose} disabled={isSaving}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default EditProfileModal;
