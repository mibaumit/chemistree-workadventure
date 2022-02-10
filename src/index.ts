/// <reference path="../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />

import {bootstrapExtra} from "@workadventure/scripting-api-extra";

// The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure.
bootstrapExtra().catch(e => console.error(e));

var isFirstTimeTuto = false;
var textFirstPopup = 'Hey ! This is how to start a discussion with someone ! You can be 4 max in a bubble.';
var textSecondPopup = 'You can also use the chat to communicate ! ';
var targetObjectTutoBubble ='Tutobubble';
var targetObjectTutoChat ='tutoChat';
var targetObjectTutoExplanation ='tutoExplanation';
var popUpExplanation: any = undefined;


function launchTuto (){
    WA.ui.openPopup(targetObjectTutoBubble, textFirstPopup, [
        {
            label: "Next",
            className: "normal",
            callback: (popup) => {
                popup.close();

                WA.ui.openPopup(targetObjectTutoChat, textSecondPopup, [
                    {
                        label: "Open Chat",
                        className: "normal",
                        callback: (popup1) => {
                            WA.chat.sendChatMessage("Hey you can talk here too!", 'WA Guide');
                            popup1.close();
                            WA.ui.openPopup("TutoFinal","You are good to go! Go through the gate to meet the dev team and discover the features !",[
                                {
                                    label: "Got it!",
                                    className : "success",callback:(popup2 => {
                                        popup2.close();
                                        WA.controls.restorePlayerControls();
                                    })
                                }
                            ])
                        }
                    }

                ])
            }
        }
    ]);
    WA.controls.disablePlayerControls();
}


WA.room.onEnterLayer('popupZone').subscribe(() => {
    WA.ui.displayBubble();
    if (!isFirstTimeTuto) {
        isFirstTimeTuto = true;
        launchTuto();
    }
    else {
        popUpExplanation = WA.ui.openPopup(targetObjectTutoExplanation, 'Do you want to review the explanation?', [
            {
                label: "No",
                className: "error",
                callback: (popup) => {
                    popup.close();
                }
            },
            {
                label: "Yes",
                className: "success",
                callback: (popup) => {
                    popup.close();
                    launchTuto();
                }
            }
        ])
    }
});

WA.room.onLeaveLayer('popupZone').subscribe(() => {
    if (popUpExplanation !== null) popUpExplanation.close();
    WA.ui.removeBubble();
})
