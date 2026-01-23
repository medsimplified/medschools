/**
 * FontAwesome Icon Library (Optimized)
 * 
 * This file contains commonly used FontAwesome icons in a tree-shakeable format.
 * Import icons from here instead of using the full CSS library.
 * 
 * Usage:
 * import { FaStar, FaUser } from '@/lib/fontAwesomeIcons';
 * <FaStar />
 */

// Solid Icons
export { 
  FaStar,
  FaUser,
  FaBook,
  FaVideo,
  FaPlay,
  FaSearch,
  FaCamera,
  FaHeart,
  FaShoppingCart,
  FaCrown,
  FaCheck,
  FaTimes,
  FaChevronRight,
  FaChevronLeft,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

// Brand Icons
export {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
  FaGooglePlusG,
} from 'react-icons/fa';

// Regular Icons
export {
  FaRegWindowClose,
} from 'react-icons/fa';

/**
 * NOTE: To complete FontAwesome optimization:
 * 
 * 1. Replace <i className="fas fa-star"></i> with:
 *    import { FaStar } from '@/lib/fontAwesomeIcons';
 *    <FaStar />
 * 
 * 2. After converting all icons, remove this line from layout.tsx:
 *    import "@fortawesome/fontawesome-free/css/all.min.css";
 * 
 * 3. Benefit: Reduce bundle size from ~900KB to ~20-50KB
 * 
 * Priority: Low (can be done incrementally after deployment)
 */
