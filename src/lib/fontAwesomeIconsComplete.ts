/**
 * FontAwesome Icon Library (Complete - Optimized)
 * 
 * This file contains ALL FontAwesome icons used in the codebase in a tree-shakeable format.
 * Instead of importing the entire FontAwesome CSS (~900KB), we import only needed icons.
 * 
 * Usage:
 * import { FaStar, FaUser } from '@/lib/fontAwesomeIconsComplete';
 * <FaStar />
 */

// Solid icons from react-icons/fa
export {
  FaStar,
  FaUser,
  FaBook,
  FaVideo,
  FaGraduationCap,
  FaSearch,
  FaTimes,
  FaWindowClose,
  FaFilePdf,
  FaQuestionCircle,
  FaStethoscope,
  FaCrown,
  FaCheckCircle,
  FaCamera,
  FaLock,
  FaUnlock,
  FaExclamationTriangle,
  FaUserCircle,
  FaClock,
  FaLanguage,
  FaListUl,
  FaBookmark,
  FaSitemap,
  FaCircle,
  FaRocket,
  FaPlayCircle,
  FaInfinity,
  FaCreditCard,
  FaAngleRight,
  FaPlay,
  FaMagic,
  FaDownload,
  FaArrowRight,
  FaArrowLeft,
  FaPhoneAlt,
  FaShoppingCart,
  FaMedal,
  FaPlus,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowUp,
  FaBars,
  FaTimes as FaClose
} from 'react-icons/fa';

// Additional solid/medical/utility icons from react-icons/fa
export {
  FaAssistiveListeningSystems,
  FaBalanceScale,
  FaBone,
  FaBrain,
  FaChild,
  FaFemale,
  FaEye,
  FaFileMedical,
  FaFlask,
  FaHandHoldingHeart,
  FaHeartbeat,
  FaHospitalUser,
  FaMedkit,
  FaPills,
  FaSun,
  FaUsers,
  FaVials,
  FaVirus,
  FaUserMd,
  FaUserNurse,
  FaUserInjured
} from 'react-icons/fa';

// Regular icons from react-icons/fa
export {
  FaRegHeart,
  FaRegEye,
  FaRegBookmark,
  FaRegEnvelope
} from 'react-icons/fa';

// Brand icons
export {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaPinterestP,
  FaGooglePlusG
} from 'react-icons/fa';

/**
 * CONVERSION STATUS: Ready for deployment
 * 
 * After converting all 121 icon usages, remove FontAwesome CSS import from layout.tsx:
 * import "@fortawesome/fontawesome-free/css/all.min.css";
 * 
 * Expected savings: ~850KB (900KB FA CSS - 50KB react-icons)
 */
