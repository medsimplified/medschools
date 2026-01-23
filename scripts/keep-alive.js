/**
 * Keep-Alive Script for Render Free Tier
 * 
 * This script prevents your Render app from going to sleep by pinging the health endpoint.
 * Run this on a server/computer that's always on, or use a cron service.
 * 
 * Alternative: Use services like:
 * - UptimeRobot (https://uptimerobot.com) - Free, simple
 * - cron-job.org (https://cron-job.org) - Free, reliable
 * - Render Cron Jobs (Paid plan only)
 */

const APP_URL = process.env.APP_URL || 'https://your-app.onrender.com';
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes (free tier sleeps after 15 min)

async function pingHealth() {
  try {
    const response = await fetch(`${APP_URL}/api/health`);
    const data = await response.json();
    
    if (data.status === 'healthy') {
      console.log(`✅ [${new Date().toISOString()}] App is healthy - Uptime: ${Math.floor(data.uptime)}s, Memory: ${data.memory.used}MB`);
    } else {
      console.log(`⚠️  [${new Date().toISOString()}] App is unhealthy:`, data);
    }
  } catch (error) {
    console.error(`❌ [${new Date().toISOString()}] Failed to ping:`, error.message);
  }
}

// Initial ping
console.log(`🚀 Starting keep-alive service for ${APP_URL}`);
console.log(`📡 Pinging every ${PING_INTERVAL / 1000 / 60} minutes`);
pingHealth();

// Set interval
setInterval(pingHealth, PING_INTERVAL);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down keep-alive service...');
  process.exit(0);
});
