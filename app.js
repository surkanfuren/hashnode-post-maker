import chalk from "chalk";
import admin from "firebase-admin";
import { publishContent } from "./modules/publisher.js";
import { getMessaging } from "firebase-admin/messaging";
import serviceAccount from "./firebase/findart-f05cf-firebase-adminsdk-nwwof-63e6d299c4.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendPushNotification(title, body, image) {
  try {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      android: {
        notification: {
          sound: "default",
          priority: "high",
          channelId: "default-channel-id",
          icon: "notification_icon",
          color: "#FF0000",
          imageUrl: "https://your-image-url.com/image.jpg",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            "mutable-content": 1,
            "content-available": 1,
          },
        },
        headers: {
          "apns-priority": "10",
        },
        fcm_options: {
          image: image,
        },
      },
      topic: "all_users",
    };
    const response = await getMessaging().send(message);
    console.log(
      chalk.green.bold(
        `✓ Push notification sent successfully: ${chalk.underline(response)}`
      )
    );
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}

async function publishAndNotify() {
  try {
    const { publishPostInput, artist } = await publishContent();
    await sendPushNotification(
      "Art of the Day",
      `${publishPostInput.title} by ${artist}`,
      publishPostInput.coverImageOptions.coverImageURL
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

publishAndNotify();
