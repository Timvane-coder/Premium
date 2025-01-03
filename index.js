"use strict";

const crypto = require("crypto");
const config = require("config");
const bodyParser = require('body-parser');
const request = require('request');
const  express = require('express');
const http = require('http');
const { buddyMd } = require('./src/Utils/Buddy');
const path = require('path');
const { buddyStatistic } = require('./src/Plugin/BuddyStatistic');
const socketIo = require('socket.io'); // Require Socket.IO
const sqlite3 = require("sqlite3").verbose();
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO with the HTTP server
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* jshint node: true, devel: true */

app.use(bodyParser.json({ verify: verifyRequestSignature }));

/*
 * Open config/default.json and set your config values before running this code.
 * You can also set them using environment variables.
 *
 */

// App Secret can be retrieved from the App Dashboard
const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
  process.env.MESSENGER_APP_SECRET :
  config.get('appSecret');

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
  (process.env.MESSENGER_VALIDATION_TOKEN) :
  config.get('validationToken');

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');

// URL where the app is running. Used to point to scripts and
// assets located at this address. DO NOT INCLUDE THE PROTOCOL
const SERVER_URL = (process.env.SERVER_URL) ?
  (process.env.SERVER_URL) :
  config.get('serverURL');

// The protocol must be HTTPS so don't allow it to be configurable
// avoid accidental misconfiguration by hard coding it
const IMG_BASE_PATH =  'https://' + SERVER_URL + "/Public/assets/";

// make sure that everything has been properly configured
if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
  console.error("Missing config values");
  process.exit(1);
}

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * your App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // In DEV, log an error. In PROD, throw an error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

/*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */
app.get('/webhook', function(req, res) {
    //res.sendStatus(200);
    if (req.query['hub.mode'] === 'subscribe' &&
          req.query['hub.verify_token'] === VALIDATION_TOKEN) {
        console.log("[app.get] Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});


/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page.
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook', function (req, res) {
    console.log('received message');
    var data = req.body;

    // if (data.object == 'page'){
    //   res.sendStatus(200);
    // }
    // Make sure this is a page subscription
    if (data.object == 'page') {
      // entries may be batched so iterate over each one
      data.entry.forEach(function(pageEntry) {
        var pageID = pageEntry.id;
        var timeOfEvent = pageEntry.time;
    
        // iterate over each messaging event
        pageEntry.messaging.forEach(function(messagingEvent) {
    
          let propertyNames = [];
          for (var prop in messagingEvent) { propertyNames.push(prop)}
          console.log("[app.post] Webhook received a messagingEvent with properties: ", propertyNames.join());
    
          if (messagingEvent.message) {
            // someone sent a message
            receivedMessage(messagingEvent);
    
          } else if (messagingEvent.delivery) {
            // messenger platform sent a delivery confirmation
            receivedDeliveryConfirmation(messagingEvent);
    
          } else if (messagingEvent.postback) {
            // user replied by tapping one of our postback buttons
            console.log('if user click the option');
            receivedPostback(messagingEvent);
    
          } else {
            console.log("[app.post] Webhook is not prepared to handle this message.");
          }
        });
      });
    
      // Assume all went well.
      //
      // You must send back a 200, within 20 seconds, to let us know you've
      // successfully received the callback. Otherwise, the request will time out.
      res.sendStatus(200);
    }
});

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 */
function receivedMessage(event) {
  var senderID = event.sender.id;
  var pageID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("[receivedMessage] user (%d) page (%d) timestamp (%d) and message (%s)",
    senderID, pageID, timeOfMessage, JSON.stringify(message));

  if (message.quick_reply) {
    console.log("[receivedMessage] quick_reply.payload (%s)",
      message.quick_reply.payload);
    handleQuickReplyResponse(event);
    console.log('masuk sini');
    return;
  }

  var messageText = message.text;
  if (messageText) {

    var lcm = messageText.toLowerCase();
    switch (lcm) {
      // if the text matches any special keywords, handle them accordingly
      case 'help':
        //sendHelpOptionsAsQuickReplies(senderID);
        sendHelpOptionsAsButtonTemplates(senderID);
        break;
      case 'menu':
        sendHelpOptionsAsQuickReplies(senderID);
        break;
      case 'audio':
        sendAudioMessage(senderID);
        break;
      case 'button':
        sendButtonMessage(senderID);
        break;
      case 'quick':
        sendQuickReply(senderID);
        break;
      case 'video':
        sendVideoMessage(senderID);
        break;
      case 'shop':
        sendTshirtShop(senderID);    
        break;
      case 'receipt':
        sendReadReceipt(senderID);
        break;        
      case 'start':
        sendTshirtShopMore(senderID);
        break;
      default:
        // otherwise, just echo it back to the sender
        sendTextMessage(senderID, messageText);
    }
  }
}

/*
 * Send a message with the four Quick Reply buttons that will allow the user to get started.
 *
 */
function sendHelpOptionsAsQuickReplies(recipientId) {
  console.log("[sendHelpOptionsAsQuickReplies] Sending the help options menu");
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "Select a feature to learn more.",
      quick_replies: [
        {
          "content_type":"text",
          "title":"Rotation",
          "payload":"QR_ROTATION_1"
        },
        {
          "content_type":"text",
          "title":"Photo",
          "payload":"QR_PHOTO_1"
        },
        {
          "content_type":"text",
          "title":"Caption",
          "payload":"QR_CAPTION_1"
        },
        {
          "content_type":"text",
          "title":"Background",
          "payload":"QR_BACKGROUND_1"
        }
      ]
    }
  };

  callSendAPI(messageData);
}

function sendQuickReply(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "What's your favorite movie genre?",
      quick_replies: [
        {
          "content_type":"text",
          "title":"Action",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
        },
        {
          "content_type":"text",
          "title":"Comedy",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
        },
        {
          "content_type":"text",
          "title":"Drama",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
        }
      ]
    }
  };

  callSendAPI(messageData);
}

function sendButtonMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "This is test text",
          buttons:[{
            type: "web_url",
            url: "https://www.oculus.com/en-us/rift/",
            title: "Open Web URL"
          }, {
            type: "postback",
            title: "Trigger Postback",
            payload: "DEVELOPER_DEFINED_PAYLOAD"
          }, {
            type: "phone_number",
            title: "Call Phone Number",
            payload: "+16505551234"
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
      
}
            


function sendTshirtShop(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url: IMG_BASE_PATH + "/Public/assets/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url: IMG_BASE_PATH + "/Public/assets/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
                     
}

  
function sendTshirtShopMore(recipientId, requestForHelpOnFeature) {
  console.log("Tshirt view more");
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment:{
        type:"template",
        payload:{
          template_type:"receipt",
          recipient_name:"Vesper Harmony",
          order_number:"12345678902",
          currency:"USD",
          payment_method:"Visa 2345",        
          order_url:"http://petersapparel.parseapp.com/order?order_id=123456",
          timestamp:"1428444852",         
          address:{
            street_1:"Blantyre",
            street_2:"",
            city:"Blantyre",
            postal_code:"4444",
            state:"Southern",
            country:"MW"
          },
          summary:{
            subtotal:75.000,
            shipping_cost:4.95,
            total_tax:6.19,
            total_cost:200000
          },
          adjustments:[
            {
              name:"New Customer Discount",
              amount:20
            },
            {
              name:"$10 Off Coupon",
              amount:10
            }
          ],
          elements:[
            {
              title:"Classic White T-Shirt",
              subtitle:"100% Soft and Luxurious Cotton",
              quantity:2,
              price:50,
              currency:"USD",
              image_url:"https://downdistro.files.wordpress.com/2012/08/kostum_baju_bola_4ff3140a6a23e1.jpg"
            },
            {
              title:"Classic Gray T-Shirt",
              subtitle:"100% Soft and Luxurious Cotton",
              quantity:1,
              price:25,
              currency:"USD",
              image_url:"https://downdistro.files.wordpress.com/2012/08/kostum_baju_bola_4ff3140a6a23e1.jpg"
            }
          ]
        }
      }
    }
  };

  callSendAPI(messageData);
}






function sendAudioMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "audio",
        payload: {
          url: "https://coral-ape-1798.twil.io/assets/water.mp3"
        }
      }
    }
  };

  callSendAPI(messageData);
}

function sendVideoMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "video",
        payload: {
          url: "https://coral-ape-1798.twil.io/assets/trailer.mp4"
        }
      }
    }
  };

  callSendAPI(messageData);
}






/*
 * Send a message with buttons that allow the user to select from
 * three of the four features.
 *
 */
function sendHelpOptionsAsButtonTemplates(recipientId) {
  console.log("[sendHelpOptionsAsButtonTemplates] Sending the help options menu");
  var messageData = {
    recipient: {
      id: recipientId
    },
    message:{
      attachment:{
        type:"template",
        payload:{
          template_type:"button",
          text:"Pick one of the three features listed below to learn more. Other features will be availble after you get started.",
          buttons:[
            {
              "type":"postback",
              "title":"Rotation",
              "payload":"QR_ROTATION_1"
            }
            ,{
              "type":"postback",
              "title":"Photo",
              "payload":"QR_PHOTO_1"
            }
            ,{
              "type":"postback",
              "title":"Caption",
              "payload":"QR_CAPTION_1"
            }
            // ,{
            //   "type":"postback",
            //   "title":"Background",
            //   "payload":"QR_BACKGROUND_1"
            // }
            // limit of up to three buttons
          ]
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
 * Someone tapped one of the Quick Reply buttons so
 * respond with the appropriate content
 *
 */
function handleQuickReplyResponse(event) {
  var senderID = event.sender.id;
  var pageID = event.recipient.id;
  var message = event.message;
  var quickReplyPayload = message.quick_reply.payload;

  console.log("[handleQuickReplyResponse] Handling quick reply response (%s) from sender (%d) to page (%d) with message (%s)",
    quickReplyPayload, senderID, pageID, JSON.stringify(message));

  // use linear conversation with one interaction per piece of content
  // respondToHelpRequestWithLinearPhotos(senderID, quickReplyPayload);

  // use branched conversation with one interaction per feature (each of which contains a variable number of content pieces)
  respondToHelpRequestWithTemplates(senderID, quickReplyPayload);

}

/*
 * This response uses templateElements to present the user with a carousel
 * You send ALL of the content for the selected feature and they can
 * swipe from side to side to see it
 *
 */
function respondToHelpRequestWithTemplates(recipientId, requestForHelpOnFeature) {
  console.log("[respondToHelpRequestWithTemplates] handling help request for %s",
    requestForHelpOnFeature);
  var templateElements = [];
  var sectionButtons = [];
  // each button must be of type postback but title
  // and payload are variable depending on which
  // set of options you want to provide
  var addSectionButton = function(title, payload) {
    sectionButtons.push({
      type: 'postback',
      title: title,
      payload: payload
    });
  }

  // Since there are only four options in total, we will provide
  // buttons for each of the remaining three with each section.
  // This provides the user with maximum flexibility to navigate

  switch (requestForHelpOnFeature) {
    case 'QR_ROTATION_1':
      addSectionButton('Photo', 'QR_PHOTO_1');
      addSectionButton('Caption', 'QR_CAPTION_1');
      addSectionButton('Background', 'QR_BACKGROUND_1');

      templateElements.push(
        {
          title: "Rotation",
          subtitle: "portrait mode",
          image_url: IMG_BASE_PATH + "01-rotate-landscape.png",
          buttons: sectionButtons
        },
        {
          title: "Rotation",
          subtitle: "landscape mode",
          image_url: IMG_BASE_PATH + "02-rotate-portrait.png",
          buttons: sectionButtons
        }
      );
    break;
    case 'QR_PHOTO_1':
      addSectionButton('Rotation', 'QR_ROTATION_1');
      addSectionButton('Caption', 'QR_CAPTION_1');
      addSectionButton('Background', 'QR_BACKGROUND_1');

      templateElements.push(
        {
          title: "Photo Picker",
          subtitle: "click to start",
          image_url: IMG_BASE_PATH + "03-photo-hover.png",
          buttons: sectionButtons
        },
        {
          title: "Photo Picker",
          subtitle: "Downloads folder",
          image_url: IMG_BASE_PATH + "04-photo-list.png",
          buttons: sectionButtons
        },
        {
          title: "Photo Picker",
          subtitle: "photo selected",
          image_url: IMG_BASE_PATH + "05-photo-selected.png",
          buttons: sectionButtons
        }
      );
    break;
    case 'QR_CAPTION_1':
      addSectionButton('Rotation', 'QR_ROTATION_1');
      addSectionButton('Photo', 'QR_PHOTO_1');
      addSectionButton('Background', 'QR_BACKGROUND_1');

      templateElements.push(
        {
          title: "Caption",
          subtitle: "click to start",
          image_url: IMG_BASE_PATH + "06-text-hover.png",
          buttons: sectionButtons
        },
        {
          title: "Caption",
          subtitle: "enter text",
          image_url: IMG_BASE_PATH + "07-text-mid-entry.png",
          buttons: sectionButtons
        },
        {
          title: "Caption",
          subtitle: "click OK",
          image_url: IMG_BASE_PATH + "08-text-entry-done.png",
          buttons: sectionButtons
        },
        {
          title: "Caption",
          subtitle: "Caption done",
          image_url: IMG_BASE_PATH + "09-text-complete.png",
          buttons: sectionButtons
        }
      );
    break;
    case 'QR_BACKGROUND_1':
      addSectionButton('Rotation', 'QR_ROTATION_1');
      addSectionButton('Photo', 'QR_PHOTO_1');
      addSectionButton('Caption', 'QR_CAPTION_1');

      templateElements.push(
        {
          title: "Background Color Picker",
          subtitle: "click to start",
          image_url: IMG_BASE_PATH + "10-background-picker-hover.png",
          buttons: sectionButtons
        },
        {
          title: "Background Color Picker",
          subtitle: "click current color",
          image_url: IMG_BASE_PATH + "11-background-picker-appears.png",
          buttons: sectionButtons
        },
        {
          title: "Background Color Picker",
          subtitle: "select new color",
          image_url: IMG_BASE_PATH + "12-background-picker-selection.png",
          buttons: sectionButtons
        },
        {
          title: "Background Color Picker",
          subtitle: "click ok",
          image_url: IMG_BASE_PATH + "13-background-picker-selection-made.png",
          buttons: sectionButtons
        },
        {
          title: "Background Color Picker",
          subtitle: "color is applied",
          image_url: IMG_BASE_PATH + "14-background-changed.png",
          buttons: sectionButtons
        }
      );
    break;
  }

  if (templateElements.length < 2) {
    console.error("each template should have at least two elements");
  }

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: templateElements
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
 * This response uses image attachments to illustrate each step of each feature.
 * This is less flexible because you are limited in the number of options you can
 * provide for the user. This technique is best for cases where the content should
 * be consumed in a strict linear order.
 *
 */
function respondToHelpRequestWithLinearPhotos(recipientId, helpRequestType) {
  var textToSend = '';
  var quickReplies = [
    {
      "content_type":"text",
      "title":"Restart",
      "payload":"QR_RESTART"
    }, // this option should always be present because it allows the user to start over
    {
      "content_type":"text",
      "title":"Continue",
      "payload":""
    } // the Continue option only makes sense if there is more content to show
      // remove this option when you are at the end of a branch in the content tree
      // i.e.: when you are showing the last message for the selected feature
  ];

  // to send an image attachment in a message, just set the payload property of this attachment object
  // if the payload property is defined, this will be added to the message before it is sent
  var attachment = {
    "type": "image",
    "payload": ""
  };

  switch(helpRequestType) {
    case 'QR_RESTART' :
      sendHelpOptions(recipientId);
      return;
    break;

    // the Rotation feature
    case 'QR_ROTATION_1' :
      textToSend = 'Click the Rotate button to toggle the poster\'s orientation between landscape and portrait mode.';
      quickReplies[1].payload = "QR_ROTATION_2";
    break;
    case 'QR_ROTATION_2' :
      // 1 of 2 (portrait, landscape)
      attachment.payload = {
        url: IMG_BASE_PATH + "01-rotate-landscape.png"
      }
      quickReplies[1].payload = "QR_ROTATION_3";
    break;
    case 'QR_ROTATION_3' :
      // 2 of 2 (portrait, landscape)
      attachment.payload = {
        url: IMG_BASE_PATH + "02-rotate-portrait.png"
      }
      quickReplies.pop();
      quickReplies[0].title = "Explore another feature";
    break;
    // the Rotation feature


    // the Photo feature
    case 'QR_PHOTO_1' :
      textToSend = 'Click the Photo button to select an image to use on your poster. We recommend visiting https://unsplash.com/random from your device to seed your Downloads folder with some images before you get started.';
      quickReplies[1].payload = "QR_PHOTO_2";
    break;
    case 'QR_PHOTO_2' :
      // 1 of 3 (placeholder image, Downloads folder, poster with image)
      attachment.payload = {
        url: IMG_BASE_PATH + "03-photo-hover.png"
      }
      quickReplies[1].payload = "QR_PHOTO_3";
    break;
    case 'QR_PHOTO_3' :
      // 2 of 3 (placeholder image, Downloads folder, poster with image)
      attachment.payload = {
        url: IMG_BASE_PATH + "04-photo-list.png"
      }
      quickReplies[1].payload = "QR_PHOTO_4";
    break;
    case 'QR_PHOTO_4' :
      // 3 of 3 (placeholder image, Downloads folder, poster with image)
      attachment.payload = {
        url: IMG_BASE_PATH + "05-photo-selected.png"
      }
      quickReplies.pop();
      quickReplies[0].title = "Explore another feature";
    break;
    // the Photo feature


    // the Caption feature
    case 'QR_CAPTION_1' :
      textToSend = 'Click the Text button to set the caption that appears at the bottom of the poster.';
      quickReplies[1].payload = "QR_CAPTION_2";
    break;
    case 'QR_CAPTION_2' :
      // 1 of 4 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "06-text-hover.png"
      }
      quickReplies[1].payload = "QR_CAPTION_3";
    break;
    case 'QR_CAPTION_3' :
      // 2 of 4: (hover, entering caption, mid-edit, poster with new caption
      attachment.payload = {
        url: IMG_BASE_PATH + "07-text-mid-entry.png"
      }
      quickReplies[1].payload = "QR_CAPTION_4";
    break;
    case 'QR_CAPTION_4' :
      // 3 of 4 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "08-text-entry-done.png"
      }
      quickReplies[1].payload = "QR_CAPTION_5";
    break;
    case 'QR_CAPTION_5' :
      // 4 of 4 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "09-text-complete.png"
      }
      quickReplies.pop();
      quickReplies[0].title = "Explore another feature";
    break;
    // the Caption feature



    // the Color Picker feature
    case 'QR_BACKGROUND_1' :
      textToSend = 'Click the Background button to select a background color for your poster.';
      quickReplies[1].payload = "QR_BACKGROUND_2";
    break;
    case 'QR_BACKGROUND_2' :
      // 1 of 5 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "10-background-picker-hover.png"
      }
      quickReplies[1].payload = "QR_BACKGROUND_3";
    break;
    case 'QR_BACKGROUND_3' :
      // 2 of 5 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "11-background-picker-appears.png"
      }
      quickReplies[1].payload = "QR_BACKGROUND_4";
    break;
    case 'QR_BACKGROUND_4' :
      // 3 of 5 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "12-background-picker-selection.png"
      }
      quickReplies[1].payload = "QR_BACKGROUND_5";
    break;
    case 'QR_BACKGROUND_5' :
      // 4 of 5 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "13-background-picker-selection-made.png"
      }
      quickReplies[1].payload = "QR_BACKGROUND_6";
    break;
    case 'QR_BACKGROUND_6' :
      // 5 of 5 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "14-background-changed.png"
      }
      quickReplies.pop();
      quickReplies[0].title = "Explore another feature";
    break;
    // the Color Picker feature

    default :
      sendHelpOptions(recipientId);
      return;

    break;
  }

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: textToSend,
      quick_replies: quickReplies
    },
  };
  if (attachment.payload !== "") {
    messageData.message.attachment = attachment;
    // text can not be specified when you're sending an attachment
    delete messageData.message.text;
  }

  callSendAPI(messageData);
}

/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
function receivedDeliveryConfirmation(event) {
  var senderID = event.sender.id; // the user who sent the message
  var recipientID = event.recipient.id; // the page they sent it from
  var delivery = event.delivery;
  var messageIDs = delivery.mids;
  var watermark = delivery.watermark;
  var sequenceNumber = delivery.seq;

  if (messageIDs) {
    messageIDs.forEach(function(messageID) {
      console.log("[receivedDeliveryConfirmation] Message with ID %s was delivered",
        messageID);
    });
  }

  console.log("[receivedDeliveryConfirmation] All messages before timestamp %d were delivered.", watermark);
}

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 *
 */
function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload;

  console.log("[receivedPostback] from user (%d) on page (%d) with payload ('%s') " +
    "at (%d)", senderID, recipientID, payload, timeOfPostback);
  switch (payload) {
    case 'VIEW_MORE': 
      sendTshirtShopMore(senderID, payload);
      break;
    default:
      respondToHelpRequestWithTemplates(senderID, payload);
      return;
    break;
  }
  
}

/*
 * Send a text message using the Send API.
 *
 */
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText, // utf-8, 640-character max
      metadata: "DEVELOPER_DEFINED_METADATA",
      // attachment:{
      //   type: "image",
      //   payload:{
      //     url:"https://preview.ibb.co/hFpxhQ/Screen_Shot_2017_08_26_at_22_56_03.png"
      //   }
      // }
    }
  };

  callSendAPI(messageData);
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("[callSendAPI] Successfully sent message with id %s to recipient %s",
          messageId, recipientId);
      } else {
      console.log("[callSendAPI] Successfully called Send API for recipient %s",
        recipientId);
      }
    } else {
      console.error("[callSendAPI] Send API call failed", response.statusCode, response.statusMessage, body.error);
    }
  });
}

/*
 * Start server
 * Webhooks must be available via SSL with a certificate signed by a valid
 * certificate authority.
 */


let blogs = [
  {
    id: "1",
    title: "How To Build A RESTAPI With Javascript",
    avatar: "images/blog1.jpg",
    intro:
      "iste odio beatae voluptas dolor praesentium illo facere optio nobis magni, aspernatur quas.",
  },
  {
    id: "2",
    title: "How to Build an PWA application with Node.js",
    avatar: "images/blog2.jpg",
    intro:
      "iste odio beatae voluptas dolor praesentium illo facere optio nobis magni, aspernatur quas.",
  },
  {
    id: "3",
    title: "Building a Trello Clone with React DnD",
    avatar: "images/blog3.jpg",
    intro:
      "iste odio beatae voluptas dolor praesentium illo facere optio nobis magni, aspernatur quas.",
  },
];



let songs = [
  {
    id: "1",
    title: "longing dance by Lee Ji Eun",
    avatar: "images/jennie.jpg",
    path:"images/longing.mp3",
  },
  {
    id: "2",
    title: "hapa by Emmie Deebo",
    avatar: "images/hapa.jpg",
    path:"images/hapa.mp3",
  },
  {
    id: "3",
    title: "controla by Onesimus",
    avatar: "images/dubula.jpg",
    path:"images/Onesimus.mp3",
  },
  {
    id: "4",
    title: "gogogo by zeze",
    avatar: "images/zeze.png",
    path:"images/gogogo.mp3",
  },
  
  {
    id: "5",
    title: "Handede by Driemo",
    avatar: "images/handede.jpg",
    path:"images/Handede.mp3",
  },
  {
    id: "6",
    title: "busy by Lady Aika",
    avatar: "images/aika.jpg",
    path:"images/busy.mp3",
  },
  {
    id: "7",
    title: "yamica by Jose Joaquim Chefe",
    avatar: "images/josep.jpg",
    path:"images/yamica.mp3",
  },
  
  {
    id: "8",
    title: "hold me by Heize",
    avatar: "images/heize.webp",
    path:"images/hold_me.mp3",
  },
];




const db = new sqlite3.Database("db.sqlite", (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
  }
});


// Set up database (run once to create the table)


db.run(
  `CREATE TABLE blog (id INTEGER PRIMARY KEY AUTOINCREMENT, title text,avatar text,intro text)`,
  (err) => {
    if (err) {
      // console.log(err)
      // Table already created
    } else {
      // Table just created, creating some rows
      var insert = "INSERT INTO blog (title, avatar, intro) VALUES (?,?,?)";
      blogs.map((blog) => {
        db.run(insert, [
          `${blog.title}`,
          `${blog.avatar}`,
          `${blog.intro}`,
        ]);
      });
    }
  }
);

db.run(
  `CREATE TABLE music (id INTEGER PRIMARY KEY AUTOINCREMENT, title text,avatar text,path text)`,
  (err) => {
    if (err) {
      // console.log(err)
      // Table already created
    } else {
      // Table just created, creating some rows
      var insert = "INSERT INTO music (title, avatar, path) VALUES (?,?,?)";
      songs.map((music) => {
        db.run(insert, [
          `${music.title}`,
          `${music.avatar}`,
          `${music.path}`,
        ]);
      });
    }
  }
);


// API to get music data

// Serve static files from the 'Public' folder
app.use(express.static(path.join(__dirname, 'Public')));

// Define your other routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Public/index.html'));
});

app.get("/blogs", async (req, res) => {
  db.all("select * from blog", (err, rows) => {
    if (err) return err;
    res.status(200).json({
      rows,
    });
  });
});

app.get('/music', (req, res) => {
    db.all('SELECT * FROM music', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ music: rows });
    });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected'); // Log when a user connects
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Improved Error Handling with More Detail
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the full error stack for debugging
    const statusCode = err.statusCode || 500; // Use a custom status code if set, otherwise 500
    const errorMessage = err.message || 'Internal Server Error'; // Use a custom message if set
    res.status(statusCode).send(errorMessage);
});

// Start the server
(async () => {
    try {
        buddyStatistic(app, io);
        // Main function to download ffmpeg
        server.listen(port, async () => {
            console.log(`Server is listening on port ${port}`);
            await buddyMd(io, app);
        });
    } catch (err) {
        console.error('Error starting server or running functions:', err);
    }
})();

module.exports = app;
