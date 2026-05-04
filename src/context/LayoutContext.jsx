import React, { createContext, useState, useEffect, useContext } from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
    // Default layout settings
    const [cardSize, setCardSize] = useState(() => {
        return localStorage.getItem('joe4cast-card-size') || 'medium';
    });

    const [glassLevel, setGlassLevel] = useState(() => {
        return localStorage.getItem('joe4cast-glass-level') || 'subtle';
    });

    const [showMetadata, setShowMetadata] = useState(() => {
        const saved = localStorage.getItem('joe4cast-show-metadata');
        return saved ? JSON.parse(saved) : {
            rating: true,
            year: true,
            category: true,
            duration: false
        };
    });

    const [heroSource, setHeroSource] = useState(() => {
        return localStorage.getItem('joe4cast-hero-source') || 'trending';
    });

    const [heroAutoNext, setHeroAutoNext] = useState(() => {
        const saved = localStorage.getItem('joe4cast-hero-autonext');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [heroInterval, setHeroInterval] = useState(() => {
        const saved = localStorage.getItem('joe4cast-hero-interval');
        return saved ? Number(saved) : 8000;
    });

    const [heroVideoQuality, setHeroVideoQuality] = useState(() => {
        return localStorage.getItem('joe4cast-hero-quality') || 'hd1080';
    });

    const [showVibeyChat, setShowVibeyChat] = useState(() => {
        const saved = localStorage.getItem('joe4cast-show-vibey-chat');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [dataSaverMode, setDataSaverMode] = useState(() => {
        const saved = localStorage.getItem('joe4cast-data-saver-mode');
        return saved !== null ? JSON.parse(saved) : false;
    });

    const [devMode, setDevMode] = useState(() => {
        const saved = localStorage.getItem('joe4cast-dev-mode');
        return saved !== null ? JSON.parse(saved) : false;
    });

    const [simulatedLatency, setSimulatedLatency] = useState(() => {
        const saved = localStorage.getItem('joe4cast-simlatency');
        return saved !== null ? JSON.parse(saved) : false;
    });

    const [animationsEnabled, setAnimationsEnabled] = useState(() => {
        const saved = localStorage.getItem('joe4cast-animations');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('joe4cast-hero-source', heroSource);
    }, [heroSource]);

    useEffect(() => {
        localStorage.setItem('joe4cast-hero-autonext', JSON.stringify(heroAutoNext));
    }, [heroAutoNext]);

    useEffect(() => {
        localStorage.setItem('joe4cast-hero-interval', heroInterval.toString());
    }, [heroInterval]);

    useEffect(() => {
        localStorage.setItem('joe4cast-hero-quality', heroVideoQuality);
    }, [heroVideoQuality]);

    useEffect(() => {
        localStorage.setItem('joe4cast-card-size', cardSize);
        document.body.setAttribute('data-card-size', cardSize);
    }, [cardSize]);

    useEffect(() => {
        localStorage.setItem('joe4cast-glass-level', glassLevel);
        document.body.setAttribute('data-glass-level', glassLevel);
    }, [glassLevel]);

    useEffect(() => {
        localStorage.setItem('joe4cast-show-metadata', JSON.stringify(showMetadata));
    }, [showMetadata]);

    useEffect(() => {
        localStorage.setItem('joe4cast-show-vibey-chat', JSON.stringify(showVibeyChat));
    }, [showVibeyChat]);

    useEffect(() => {
        localStorage.setItem('joe4cast-data-saver-mode', JSON.stringify(dataSaverMode));
    }, [dataSaverMode]);

    useEffect(() => {
        localStorage.setItem('joe4cast-dev-mode', JSON.stringify(devMode));
    }, [devMode]);

    useEffect(() => {
        localStorage.setItem('joe4cast-simlatency', JSON.stringify(simulatedLatency));
    }, [simulatedLatency]);

    useEffect(() => {
        localStorage.setItem('joe4cast-animations', JSON.stringify(animationsEnabled));
    }, [animationsEnabled]);

    const resetLayout = () => {
        setCardSize('medium');
        setGlassLevel('subtle');
        setHeroSource('trending');
        setHeroAutoNext(true);
        setHeroInterval(8000);
        setHeroVideoQuality('hd1080');
        setShowMetadata({
            rating: true,
            year: true,
            category: true,
            duration: false
        });
        setShowVibeyChat(true);
        setDataSaverMode(false);
        setDevMode(false);
        setSimulatedLatency(false);
        setAnimationsEnabled(true);
    };

    const value = {
        cardSize,
        setCardSize,
        glassLevel,
        setGlassLevel,
        showMetadata,
        setShowMetadata,
        heroSource,
        setHeroSource,
        heroAutoNext,
        setHeroAutoNext,
        heroInterval,
        setHeroInterval,
        heroVideoQuality,
        setHeroVideoQuality,
        showVibeyChat,
        setShowVibeyChat,
        dataSaverMode,
        setDataSaverMode,
        devMode,
        setDevMode,
        simulatedLatency,
        setSimulatedLatency,
        animationsEnabled,
        setAnimationsEnabled,
        resetLayout
    };

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
};
