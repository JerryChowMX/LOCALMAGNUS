/**
 * aichat router
 */

import { factories } from '@strapi/strapi';

// Create core router for the content-type (required for API registration)
export default factories.createCoreRouter('api::aichat.aichat');
