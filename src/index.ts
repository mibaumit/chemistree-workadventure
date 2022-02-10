/// <reference path="../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />

import {bootstrapExtra} from "@workadventure/scripting-api-extra";

// The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure.
bootstrapExtra().catch(e => console.error(e));

var isFirstTimeTuto = false;
var textFirstPopup = 'Hey! So fängt man ein Gespräch mit jemandem an! Es können maximal 4 Personen in einem Kreis sein.';
var textSecondPopup = 'Sie können auch den Chat zur Kommunikation nutzen!';
var targetObjectTutoBubble ='tutoBubble';
var targetObjectTutoChat ='tutoChat';
var targetObjectTutoExplanation ='tutoExplanation';
var popUpExplanation: any = undefined;


function launchTuto (){
    WA.ui.openPopup(targetObjectTutoBubble, textFirstPopup, [
        {
            label: "Weiter",
            className: "normal",
            callback: (popup) => {
                popup.close();

                WA.ui.openPopup(targetObjectTutoChat, textSecondPopup, [
                    {
                        label: "Chat öffnen",
                        className: "normal",
                        callback: (popup1) => {
                            WA.chat.sendChatMessage("Hallo, willkommen bei der CHEMISTREE Geburtstagsfeier!", 'Chemistree Guide');
                            popup1.close();
                            WA.ui.openPopup("tutoFinal","Sie sind startklar! Gehen Sie hinein, um das Chemistree Team zu treffen und die Funktionen zu entdecken!",[
                                {
                                    label: "Super!",
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
        popUpExplanation = WA.ui.openPopup(targetObjectTutoExplanation, 'Möchten Sie das Tutorial wiederholen?', [
            {
                label: "Nein",
                className: "error",
                callback: (popup) => {
                    popup.close();
                }
            },
            {
                label: "Ja",
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
