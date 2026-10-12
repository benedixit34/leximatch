import type { City } from '@/lib/types';

export const CITIES: City[] = [
    {
        level: 1,
        name: 'Vienna',
        venue: 'SCHÖNBRUNN PALACE',
        theme: 'vienna',
        icon: '🏰',
        pin: { left: 17, top: 87.5 },
        mascot: { left: 17, top: 83 },
        speechTip: 'Willkommen in Wien! Let us learn some basic German words.',
        pairs: [
            { id: 'v_1', german: 'Hallo', english: 'Hello', emoji: '👋' },
            { id: 'v_2', german: 'Nein', english: 'No', emoji: '🙅🏽‍♂️' },
            { id: 'v_3', german: 'die Tür', english: 'Door', emoji: '🚪' },
            { id: 'v_4', german: 'Ja', english: 'Yes', emoji: '✅' },
            { id: 'v_5', german: 'danke', english: 'Thanks', emoji: '🙏' },
            { id: 'v_6', german: 'bitte', english: 'Please', emoji: '🎁' }
        ]
    },

    {
        level: 2,
        name: 'Vienna',
        venue: 'ST. STEPHEN’S CATHEDRAL',
        theme: 'vienna',
        icon: '⛪',
        pin: { left: 83, top: 68.7 },
        mascot: { left: 83, top: 64 },
        speechTip: 'Willkommen zurück! Let us learn words for people and places.',
        pairs: [
            { id: 'v_7', german: 'der Mann', english: 'Man', emoji: '👨' },
            { id: 'v_8', german: 'die Frau', english: 'Woman', emoji: '👩' },
            { id: 'v_9', german: 'das Kind', english: 'Child', emoji: '🧒' },
            { id: 'v_10', german: 'die Stadt', english: 'City', emoji: '🏙️' },
            { id: 'v_11', german: 'die Kirche', english: 'Church', emoji: '⛪' },
            { id: 'v_12', german: 'der Platz', english: 'Square', emoji: '🏛️' }
        ]
    },

    {
        level: 3,
        name: 'Vienna',
        venue: 'HOFBURG PALACE',
        theme: 'vienna',
        icon: '👑',
        pin: { left: 22, top: 48 },
        mascot: { left: 22, top: 43 },
        speechTip: 'Grüße aus der Hofburg! Let us learn words about people and royalty.',
        pairs: [
            { id: 'v_13', german: 'der König', english: 'King', emoji: '🤴' },
            { id: 'v_14', german: 'die Königin', english: 'Queen', emoji: '👸' },
            { id: 'v_15', german: 'der Kaiser', english: 'Emperor', emoji: '👑' },
            { id: 'v_16', german: 'die Familie', english: 'Family', emoji: '👨‍👩‍👧‍👦' },
            { id: 'v_17', german: 'der Palast', english: 'Palace', emoji: '🏰' },
            { id: 'v_18', german: 'die Krone', english: 'Crown', emoji: '👑' }
        ]
    },

    {
        level: 4,
        name: 'Vienna',
        venue: 'BELVEDERE PALACE',
        theme: 'vienna',
        icon: '🎨',
        pin: { left: 77, top: 25 },
        mascot: { left: 77, top: 20 },
        speechTip: 'Willkommen im Belvedere! Let us learn words about art and colors.',
        pairs: [
            { id: 'v_19', german: 'das Bild', english: 'Picture', emoji: '🖼️' },
            { id: 'v_20', german: 'die Kunst', english: 'Art', emoji: '🎨' },
            { id: 'v_21', german: 'der Künstler', english: 'Artist', emoji: '👨‍🎨' },
            { id: 'v_22', german: 'rot', english: 'Red', emoji: '🔴' },
            { id: 'v_23', german: 'blau', english: 'Blue', emoji: '🔵' },
            { id: 'v_24', german: 'grün', english: 'Green', emoji: '🟢' }
        ]
    },

    {
        level: 5,
        name: 'Vienna',
        venue: 'VIENNA STATE OPERA',
        theme: 'vienna',
        icon: '🎭',
        pin: { left: 50, top: 8.3 },
        mascot: { left: 50, top: 3.5 },
        speechTip: 'Willkommen in der Oper! Let us learn music and performance words.',
        pairs: [
            { id: 'v_25', german: 'die Musik', english: 'Music', emoji: '🎵' },
            { id: 'v_26', german: 'das Lied', english: 'Song', emoji: '🎶' },
            { id: 'v_27', german: 'der Sänger', english: 'Singer', emoji: '🎤' },
            { id: 'v_28', german: 'die Bühne', english: 'Stage', emoji: '🎭' },
            { id: 'v_29', german: 'das Theater', english: 'Theater', emoji: '🎭' },
            { id: 'v_30', german: 'tanzen', english: 'To dance', emoji: '💃' }
        ]
    },

    {
        level: 6,
        name: 'Vienna',
        venue: 'PRATER',
        theme: 'vienna',
        icon: '🎡',
        pin: { left: 17, top: 87.5 },
        mascot: { left: 17, top: 83 },
        speechTip: 'Willkommen im Prater! Let us learn words for fun and entertainment.',
        pairs: [
            { id: 'v_31', german: 'der Park', english: 'Park', emoji: '🌳' },
            { id: 'v_32', german: 'das Spiel', english: 'Game', emoji: '🎮' },
            { id: 'v_33', german: 'der Spaß', english: 'Fun', emoji: '😄' },
            { id: 'v_34', german: 'fahren', english: 'To ride', emoji: '🎢' },
            { id: 'v_35', german: 'schnell', english: 'Fast', emoji: '💨' },
            { id: 'v_36', german: 'langsam', english: 'Slow', emoji: '🐢' }
        ]
    },

    {
        level: 7,
        name: 'Vienna',
        venue: 'GIANT FERRIS WHEEL',
        theme: 'vienna',
        icon: '🎡',
        pin: { left: 83, top: 68.7 },
        mascot: { left: 83, top: 64 },
        speechTip: 'Hoch hinaus! Let us learn words about movement and height.',
        pairs: [
            { id: 'v_37', german: 'hoch', english: 'High', emoji: '⬆️' },
            { id: 'v_38', german: 'niedrig', english: 'Low', emoji: '⬇️' },
            { id: 'v_39', german: 'oben', english: 'Upstairs / Above', emoji: '☝️' },
            { id: 'v_40', german: 'unten', english: 'Downstairs / Below', emoji: '👇' },
            { id: 'v_41', german: 'drehen', english: 'To turn', emoji: '🔄' },
            { id: 'v_42', german: 'das Rad', english: 'Wheel', emoji: '🎡' }
        ]
    },

    {
        level: 8,
        name: 'Vienna',
        venue: 'ALBERTINA MUSEUM',
        theme: 'vienna',
        icon: '🖼️',
        pin: { left: 22, top: 48 },
        mascot: { left: 22, top: 43 },
        speechTip: 'Willkommen in der Albertina! Let us explore museum vocabulary.',
        pairs: [
            { id: 'v_43', german: 'das Museum', english: 'Museum', emoji: '🏛️' },
            { id: 'v_44', german: 'die Farbe', english: 'Color', emoji: '🎨' },
            { id: 'v_45', german: 'schön', english: 'Beautiful', emoji: '✨' },
            { id: 'v_46', german: 'groß', english: 'Big', emoji: '🐘' },
            { id: 'v_47', german: 'klein', english: 'Small', emoji: '🐭' },
            { id: 'v_48', german: 'sehen', english: 'To see', emoji: '👀' }
        ]
    },

    {
        level: 9,
        name: 'Vienna',
        venue: 'KUNSTHISTORISCHES MUSEUM',
        theme: 'vienna',
        icon: '🏛️',
        pin: { left: 77, top: 25 },
        mascot: { left: 77, top: 20 },
        speechTip: 'Zeit für Kunst! Let us learn more words about history and art.',
        pairs: [
            { id: 'v_49', german: 'die Geschichte', english: 'History', emoji: '📜' },
            { id: 'v_50', german: 'alt', english: 'Old', emoji: '🏺' },
            { id: 'v_51', german: 'neu', english: 'New', emoji: '✨' },
            { id: 'v_52', german: 'das Museum', english: 'Museum', emoji: '🏛️' },
            { id: 'v_53', german: 'betrachten', english: 'To look at', emoji: '👀' },
            { id: 'v_54', german: 'lernen', english: 'To learn', emoji: '📚' }
        ]
    },

    {
        level: 10,
        name: 'Vienna',
        venue: 'NATURAL HISTORY MUSEUM',
        theme: 'vienna',
        icon: '🦖',
        pin: { left: 50, top: 8.3 },
        mascot: { left: 50, top: 3.5 },
        speechTip: 'Willkommen im Naturhistorischen Museum! Let us learn about animals and nature.',
        pairs: [
            { id: 'v_55', german: 'das Tier', english: 'Animal', emoji: '🐘' },
            { id: 'v_56', german: 'der Vogel', english: 'Bird', emoji: '🐦' },
            { id: 'v_57', german: 'der Fisch', english: 'Fish', emoji: '🐟' },
            { id: 'v_58', german: 'der Baum', english: 'Tree', emoji: '🌳' },
            { id: 'v_59', german: 'die Erde', english: 'Earth', emoji: '🌍' },
            { id: 'v_60', german: 'die Natur', english: 'Nature', emoji: '🌿' }
        ]
    },

    {
        level: 11,
        name: 'Vienna',
        venue: 'MUSEUMSQUARTIER',
        theme: 'vienna',
        icon: '🏛️',
        pin: { left: 17, top: 87.5 },
        mascot: { left: 17, top: 83 },
        speechTip: 'Willkommen im MuseumsQuartier! Let us explore everyday city words.',
        pairs: [
            { id: 'v_61', german: 'die Straße', english: 'Street', emoji: '🛣️' },
            { id: 'v_62', german: 'das Gebäude', english: 'Building', emoji: '🏢' },
            { id: 'v_63', german: 'der Eingang', english: 'Entrance', emoji: '🚪' },
            { id: 'v_64', german: 'der Ausgang', english: 'Exit', emoji: '🚶' },
            { id: 'v_65', german: 'hier', english: 'Here', emoji: '📍' },
            { id: 'v_66', german: 'dort', english: 'There', emoji: '👉' }
        ]
    },

    {
        level: 12,
        name: 'Vienna',
        venue: 'VIENNA CITY HALL',
        theme: 'vienna',
        icon: '🏛️',
        pin: { left: 83, top: 68.7 },
        mascot: { left: 83, top: 64 },
        speechTip: 'Willkommen im Rathaus! Let us learn words about the city.',
        pairs: [
            { id: 'v_67', german: 'die Stadt', english: 'City', emoji: '🏙️' },
            { id: 'v_68', german: 'der Bürgermeister', english: 'Mayor', emoji: '👔' },
            { id: 'v_69', german: 'das Rathaus', english: 'City Hall', emoji: '🏛️' },
            { id: 'v_70', german: 'die Arbeit', english: 'Work', emoji: '💼' },
            { id: 'v_71', german: 'helfen', english: 'To help', emoji: '🤝' },
            { id: 'v_72', german: 'gemeinsam', english: 'Together', emoji: '🤝' }
        ]
    },

    {
        level: 13,
        name: 'Vienna',
        venue: 'AUSTRIAN PARLIAMENT',
        theme: 'vienna',
        icon: '🏛️',
        pin: { left: 22, top: 48 },
        mascot: { left: 22, top: 43 },
        speechTip: 'Willkommen beim Parlament! Let us learn words about people and society.',
        pairs: [
            { id: 'v_73', german: 'das Land', english: 'Country', emoji: '🌍' },
            { id: 'v_74', german: 'der Staat', english: 'State', emoji: '🏛️' },
            { id: 'v_75', german: 'das Volk', english: 'People', emoji: '👥' },
            { id: 'v_76', german: 'die Regierung', english: 'Government', emoji: '🏛️' },
            { id: 'v_77', german: 'das Gesetz', english: 'Law', emoji: '⚖️' },
            { id: 'v_78', german: 'wählen', english: 'To vote', emoji: '🗳️' }
        ]
    },

    {
        level: 14,
        name: 'Vienna',
        venue: 'KARLSKIRCHE',
        theme: 'vienna',
        icon: '⛪',
        pin: { left: 77, top: 25 },
        mascot: { left: 77, top: 20 },
        speechTip: 'Willkommen an der Karlskirche! Let us learn more everyday words.',
        pairs: [
            { id: 'v_79', german: 'die Kirche', english: 'Church', emoji: '⛪' },
            { id: 'v_80', german: 'das Fenster', english: 'Window', emoji: '🪟' },
            { id: 'v_81', german: 'die Tür', english: 'Door', emoji: '🚪' },
            { id: 'v_82', german: 'das Licht', english: 'Light', emoji: '💡' },
            { id: 'v_83', german: 'hell', english: 'Bright', emoji: '☀️' },
            { id: 'v_84', german: 'dunkel', english: 'Dark', emoji: '🌙' }
        ]
    },

    {
        level: 15,
        name: 'Vienna',
        venue: 'PETERSKIRCHE',
        theme: 'vienna',
        icon: '⛪',
        pin: { left: 50, top: 8.3 },
        mascot: { left: 50, top: 3.5 },
        speechTip: 'Grüße aus der Peterskirche! Let us practice descriptive words.',
        pairs: [
            { id: 'v_85', german: 'schön', english: 'Beautiful', emoji: '✨' },
            { id: 'v_86', german: 'groß', english: 'Big', emoji: '📏' },
            { id: 'v_87', german: 'klein', english: 'Small', emoji: '🔹' },
            { id: 'v_88', german: 'neu', english: 'New', emoji: '🆕' },
            { id: 'v_89', german: 'alt', english: 'Old', emoji: '🏛️' },
            { id: 'v_90', german: 'ruhig', english: 'Quiet', emoji: '🤫' }
        ]
    },

    {
        level: 16,
        name: 'Vienna',
        venue: 'SPANISH RIDING SCHOOL',
        theme: 'vienna',
        icon: '🐎',
        pin: { left: 17, top: 87.5 },
        mascot: { left: 17, top: 83 },
        speechTip: 'Willkommen bei der Spanischen Hofreitschule! Let us learn animal words.',
        pairs: [
            { id: 'v_91', german: 'das Pferd', english: 'Horse', emoji: '🐎' },
            { id: 'v_92', german: 'reiten', english: 'To ride', emoji: '🏇' },
            { id: 'v_93', german: 'schnell', english: 'Fast', emoji: '💨' },
            { id: 'v_94', german: 'stark', english: 'Strong', emoji: '💪' },
            { id: 'v_95', german: 'laufen', english: 'To run', emoji: '🏃' },
            { id: 'v_96', german: 'die Schule', english: 'School', emoji: '🏫' }
        ]
    },

    {
        level: 17,
        name: 'Vienna',
        venue: 'SISI MUSEUM',
        theme: 'vienna',
        icon: '👸',
        pin: { left: 83, top: 68.7 },
        mascot: { left: 83, top: 64 },
        speechTip: 'Willkommen im Sisi Museum! Let us learn words about people and history.',
        pairs: [
            { id: 'v_97', german: 'die Kaiserin', english: 'Empress', emoji: '👸' },
            { id: 'v_98', german: 'das Kleid', english: 'Dress', emoji: '👗' },
            { id: 'v_99', german: 'die Geschichte', english: 'History', emoji: '📜' },
            { id: 'v_100', german: 'die Familie', english: 'Family', emoji: '👨‍👩‍👧‍👦' },
            { id: 'v_101', german: 'die Frau', english: 'Woman', emoji: '👩' },
            { id: 'v_102', german: 'berühmt', english: 'Famous', emoji: '⭐' }
        ]
    },

    {
        level: 18,
        name: 'Vienna',
        venue: 'IMPERIAL TREASURY',
        theme: 'vienna',
        icon: '💎',
        pin: { left: 22, top: 48 },
        mascot: { left: 22, top: 43 },
        speechTip: 'Willkommen in der Schatzkammer! Let us learn words about valuable things.',
        pairs: [
            { id: 'v_103', german: 'der Schatz', english: 'Treasure', emoji: '💎' },
            { id: 'v_104', german: 'das Gold', english: 'Gold', emoji: '🥇' },
            { id: 'v_105', german: 'der Ring', english: 'Ring', emoji: '💍' },
            { id: 'v_106', german: 'die Krone', english: 'Crown', emoji: '👑' },
            { id: 'v_107', german: 'wertvoll', english: 'Valuable', emoji: '💎' },
            { id: 'v_108', german: 'reich', english: 'Rich', emoji: '💰' }
        ]
    },

    {
        level: 19,
        name: 'Vienna',
        venue: 'SCHÖNBRUNN ZOO',
        theme: 'vienna',
        icon: '🦁',
        pin: { left: 77, top: 25 },
        mascot: { left: 77, top: 20 },
        speechTip: 'Willkommen im Tiergarten Schönbrunn! Let us meet some animals.',
        pairs: [
            { id: 'v_109', german: 'der Löwe', english: 'Lion', emoji: '🦁' },
            { id: 'v_110', german: 'der Elefant', english: 'Elephant', emoji: '🐘' },
            { id: 'v_111', german: 'der Affe', english: 'Monkey', emoji: '🐒' },
            { id: 'v_112', german: 'der Bär', english: 'Bear', emoji: '🐻' },
            { id: 'v_113', german: 'die Giraffe', english: 'Giraffe', emoji: '🦒' },
            { id: 'v_114', german: 'der Tiger', english: 'Tiger', emoji: '🐅' }
        ]
    },

    {
        level: 20,
        name: 'Vienna',
        venue: 'SCHÖNBRUNN GARDENS',
        theme: 'vienna',
        icon: '🌳',
        pin: { left: 50, top: 8.3 },
        mascot: { left: 50, top: 3.5 },
        speechTip: 'Willkommen in den Schönbrunner Gärten! Let us explore nature words.',
        pairs: [
            { id: 'v_115', german: 'der Garten', english: 'Garden', emoji: '🌷' },
            { id: 'v_116', german: 'die Blume', english: 'Flower', emoji: '🌸' },
            { id: 'v_117', german: 'der Baum', english: 'Tree', emoji: '🌳' },
            { id: 'v_118', german: 'das Gras', english: 'Grass', emoji: '🌱' },
            { id: 'v_119', german: 'die Pflanze', english: 'Plant', emoji: '🪴' },
            { id: 'v_120', german: 'wachsen', english: 'To grow', emoji: '🌱' }
        ]
    },

    {
        level: 21,
        name: 'Vienna',
        venue: 'GLORIETTE',
        theme: 'vienna',
        icon: '🏛️',
        pin: { left: 17, top: 87.5 },
        mascot: { left: 17, top: 83 },
        speechTip: 'Ein wunderschöner Ausblick! Let us learn words about views.',
        pairs: [
            { id: 'v_121', german: 'die Aussicht', english: 'View', emoji: '👀' },
            { id: 'v_122', german: 'der Berg', english: 'Mountain', emoji: '⛰️' },
            { id: 'v_123', german: 'der Himmel', english: 'Sky', emoji: '🌤️' },
            { id: 'v_124', german: 'weit', english: 'Far / Wide', emoji: '🔭' },
            { id: 'v_125', german: 'oben', english: 'Above', emoji: '⬆️' },
            { id: 'v_126', german: 'schauen', english: 'To look', emoji: '👀' }
        ]
    },

    {
        level: 22,
        name: 'Vienna',
        venue: 'DANUBE TOWER',
        theme: 'vienna',
        icon: '🗼',
        pin: { left: 83, top: 68.7 },
        mascot: { left: 83, top: 64 },
        speechTip: 'Hoch über Wien! Let us learn words about height and direction.',
        pairs: [
            { id: 'v_127', german: 'der Turm', english: 'Tower', emoji: '🗼' },
            { id: 'v_128', german: 'hoch', english: 'High', emoji: '⬆️' },
            { id: 'v_129', german: 'die Stadt', english: 'City', emoji: '🏙️' },
            { id: 'v_130', german: 'der Fluss', english: 'River', emoji: '🌊' },
            { id: 'v_131', german: 'unten', english: 'Below', emoji: '⬇️' },
            { id: 'v_132', german: 'sehen', english: 'To see', emoji: '👀' }
        ]
    },

    {
        level: 23,
        name: 'Vienna',
        venue: 'STADTPARK',
        theme: 'vienna',
        icon: '🌳',
        pin: { left: 22, top: 48 },
        mascot: { left: 22, top: 43 },
        speechTip: 'Willkommen im Stadtpark! Let us practice outdoor vocabulary.',
        pairs: [
            { id: 'v_133', german: 'der Park', english: 'Park', emoji: '🌳' },
            { id: 'v_134', german: 'die Wiese', english: 'Meadow', emoji: '🌱' },
            { id: 'v_135', german: 'die Sonne', english: 'Sun', emoji: '☀️' },
            { id: 'v_136', german: 'der Weg', english: 'Path', emoji: '🚶' },
            { id: 'v_137', german: 'sitzen', english: 'To sit', emoji: '🪑' },
            { id: 'v_138', german: 'spazieren', english: 'To walk', emoji: '🚶' }
        ]
    },

    {
        level: 24,
        name: 'Vienna',
        venue: 'HOUSE OF MUSIC',
        theme: 'vienna',
        icon: '🎵',
        pin: { left: 77, top: 25 },
        mascot: { left: 77, top: 20 },
        speechTip: 'Willkommen im Haus der Musik! Let us explore sounds and music.',
        pairs: [
            { id: 'v_139', german: 'der Ton', english: 'Sound / Note', emoji: '🎵' },
            { id: 'v_140', german: 'die Stimme', english: 'Voice', emoji: '🗣️' },
            { id: 'v_141', german: 'das Klavier', english: 'Piano', emoji: '🎹' },
            { id: 'v_142', german: 'die Geige', english: 'Violin', emoji: '🎻' },
            { id: 'v_143', german: 'singen', english: 'To sing', emoji: '🎤' },
            { id: 'v_144', german: 'hören', english: 'To hear', emoji: '👂' }
        ]
    },

    {
        level: 25,
        name: 'Vienna',
        venue: 'LEOPOLD MUSEUM',
        theme: 'vienna',
        icon: '🎨',
        pin: { left: 50, top: 8.3 },
        mascot: { left: 50, top: 3.5 },
        speechTip: 'Willkommen im Leopold Museum! Let us learn more art vocabulary.',
        pairs: [
            { id: 'v_145', german: 'die Galerie', english: 'Gallery', emoji: '🖼️' },
            { id: 'v_146', german: 'das Gemälde', english: 'Painting', emoji: '🎨' },
            { id: 'v_147', german: 'der Maler', english: 'Painter', emoji: '👨‍🎨' },
            { id: 'v_148', german: 'zeichnen', english: 'To draw', emoji: '✏️' },
            { id: 'v_149', german: 'malen', english: 'To paint', emoji: '🖌️' },
            { id: 'v_150', german: 'bunt', english: 'Colorful', emoji: '🌈' }
        ]
    },

    {
        level: 26,
        name: 'Vienna',
        venue: 'MOZARTHAUS VIENNA',
        theme: 'vienna',
        icon: '🎼',
        pin: { left: 17, top: 87.5 },
        mascot: { left: 17, top: 83 },
        speechTip: 'Willkommen im Mozarthaus! Let us learn words about music and home.',
        pairs: [
            { id: 'v_151', german: 'der Komponist', english: 'Composer', emoji: '🎼' },
            { id: 'v_152', german: 'das Klavier', english: 'Piano', emoji: '🎹' },
            { id: 'v_153', german: 'das Haus', english: 'House', emoji: '🏠' },
            { id: 'v_154', german: 'wohnen', english: 'To live', emoji: '🏠' },
            { id: 'v_155', german: 'spielen', english: 'To play', emoji: '🎹' },
            { id: 'v_156', german: 'komponieren', english: 'To compose', emoji: '🎼' }
        ]
    },

    {
        level: 27,
        name: 'Vienna',
        venue: 'HUNDERTWASSER HOUSE',
        theme: 'vienna',
        icon: '🏠',
        pin: { left: 83, top: 68.7 },
        mascot: { left: 83, top: 64 },
        speechTip: 'Willkommen beim Hundertwasserhaus! Let us learn words about buildings.',
        pairs: [
            { id: 'v_157', german: 'das Gebäude', english: 'Building', emoji: '🏢' },
            { id: 'v_158', german: 'die Wand', english: 'Wall', emoji: '🧱' },
            { id: 'v_159', german: 'das Dach', english: 'Roof', emoji: '🏠' },
            { id: 'v_160', german: 'das Fenster', english: 'Window', emoji: '🪟' },
            { id: 'v_161', german: 'bunt', english: 'Colorful', emoji: '🌈' },
            { id: 'v_162', german: 'modern', english: 'Modern', emoji: '🏙️' }
        ]
    },

    {
        level: 28,
        name: 'Vienna',
        venue: 'NASCHMARKT',
        theme: 'vienna',
        icon: '🍎',
        pin: { left: 22, top: 48 },
        mascot: { left: 22, top: 43 },
        speechTip: 'Willkommen am Naschmarkt! Let us learn food and shopping words.',
        pairs: [
            { id: 'v_163', german: 'der Markt', english: 'Market', emoji: '🛍️' },
            { id: 'v_164', german: 'das Essen', english: 'Food', emoji: '🍽️' },
            { id: 'v_165', german: 'der Apfel', english: 'Apple', emoji: '🍎' },
            { id: 'v_166', german: 'das Brot', english: 'Bread', emoji: '🍞' },
            { id: 'v_167', german: 'kaufen', english: 'To buy', emoji: '🛒' },
            { id: 'v_168', german: 'bezahlen', english: 'To pay', emoji: '💳' }
        ]
    },

    {
        level: 29,
        name: 'Vienna',
        venue: 'GRABEN',
        theme: 'vienna',
        icon: '🛍️',
        pin: { left: 77, top: 25 },
        mascot: { left: 77, top: 20 },
        speechTip: 'Willkommen am Graben! Let us learn words for shopping and the city.',
        pairs: [
            { id: 'v_169', german: 'das Geschäft', english: 'Shop', emoji: '🏪' },
            { id: 'v_170', german: 'die Straße', english: 'Street', emoji: '🛣️' },
            { id: 'v_171', german: 'das Geld', english: 'Money', emoji: '💶' },
            { id: 'v_172', german: 'teuer', english: 'Expensive', emoji: '💰' },
            { id: 'v_173', german: 'billig', english: 'Cheap', emoji: '🏷️' },
            { id: 'v_174', german: 'bezahlen', english: 'To pay', emoji: '💳' }
        ]
    },

    {
        level: 30,
        name: 'Vienna',
        venue: 'KÄRNTNER STRASSE',
        theme: 'vienna',
        icon: '🚶',
        pin: { left: 50, top: 8.3 },
        mascot: { left: 50, top: 3.5 },
        speechTip: 'Willkommen auf der Kärntner Straße! You made it to the final Vienna level!',
        pairs: [
            { id: 'v_175', german: 'gehen', english: 'To go / walk', emoji: '🚶' },
            { id: 'v_176', german: 'laufen', english: 'To walk / run', emoji: '🏃' },
            { id: 'v_177', german: 'die Straße', english: 'Street', emoji: '🛣️' },
            { id: 'v_178', german: 'links', english: 'Left', emoji: '⬅️' },
            { id: 'v_179', german: 'rechts', english: 'Right', emoji: '➡️' },
            { id: 'v_180', german: 'geradeaus', english: 'Straight ahead', emoji: '⬆️' }
        ]
    }
];