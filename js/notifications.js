/* =============================================
   TITOYIN — Push Notifications (OneSignal)
   Replace ONESIGNAL_APP_ID with your real App ID
   from onesignal.com
   ============================================= */

const ONESIGNAL_APP_ID = '840812cc-6d9c-4cda-a6e1-392e8e009a5b';

// Only initialise if App ID has been set
if (ONESIGNAL_APP_ID !== 'REPLACE_WITH_YOUR_ONESIGNAL_APP_ID') {
  window.OneSignalDeferred = window.OneSignalDeferred || [];

  // Load OneSignal SDK
  const script = document.createElement('script');
  script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
  script.defer = true;
  document.head.appendChild(script);

  OneSignalDeferred.push(async function(OneSignal) {
    await OneSignal.init({
      appId: ONESIGNAL_APP_ID,
      safari_web_id: '',
      notifyButton: {
        enable: true,
        size: 'medium',
        theme: 'default',
        position: 'bottom-left',
        offset: { bottom: '20px', left: '20px', right: '20px' },
        prenotify: true,
        showCredit: false,
        text: {
          'tip.state.unsubscribed':  'Subscribe to breaking news alerts',
          'tip.state.subscribed':    '✓ You are subscribed to Titoyin alerts',
          'tip.state.blocked':       'You have blocked notifications',
          'message.prenotify':       'Click to subscribe to breaking news from Titoyin',
          'message.action.subscribed': 'Thanks for subscribing!',
          'message.action.resubscribed': 'You are subscribed to notifications',
          'message.action.unsubscribed': 'You will not receive notifications',
          'dialog.main.title':       'Manage Titoyin Notifications',
          'dialog.main.button.subscribe': 'Subscribe',
          'dialog.main.button.unsubscribe': 'Unsubscribe',
          'dialog.blocked.title':    'Unblock Notifications',
          'dialog.blocked.message':  'Follow the instructions to allow notifications',
        },
      },
    });
  });
}
