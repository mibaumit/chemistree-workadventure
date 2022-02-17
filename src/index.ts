/// <reference path="../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />

import {bootstrapExtra} from "@workadventure/scripting-api-extra";

// The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure.
bootstrapExtra().catch(e => console.error(e));

var isFirstTimeTuto = false;
var textFirstPopup = 'Herzlich willkommen im virtuellen CHEMISTREE Büro. Ich erkläre Ihnen, wie es funktioniert.';
var textSecondPopup = 'Wenn Sie sich in der Nähe einer Person befinden, öffnet sich innerhalb eines Kreises ein Videoraum. Darin können max. 4 Personen gleichzeitig sein.';
var textThirdPopup = 'In unseren Büroräumen (z. B. ROSMARIE) können sich auch mehr als 4 Personen treffen.';
var targetObjectTutoBubble = 'tutoBubble';
var targetObjectTutoExplanation = 'tutoExplanation';
var popUpExplanation: any = undefined;


function launchTuto() {
    WA.ui.openPopup(targetObjectTutoBubble, textFirstPopup, [
        {
            label: "Weiter",
            className: "normal",
            callback: (popup) => {
                popup.close();

                WA.ui.openPopup(targetObjectTutoBubble, textSecondPopup, [
                    {
                        label: "Weiter",
                        className: "normal",
                        callback: (popup1) => {
                            popup1.close();

                            WA.ui.openPopup(targetObjectTutoBubble, textThirdPopup, [
                                {
                                    label: "Weiter",
                                    className: "normal",
                                    callback: (popup2) => {
                                        popup2.close();

                                        WA.ui.openPopup("tutoFinal", "Viel Spaß in unserem Büro. Wir freuen uns auf den Austausch mit Ihnen.", [
                                            {
                                                label: "Super!",
                                                className: "success", callback: (popup3 => {
                                                    popup3.close();
                                                    WA.controls.restorePlayerControls();
                                                })
                                            }
                                        ])
                                    }
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
    } else {
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
    if (popUpExplanation !== undefined) {
        popUpExplanation.close();
    }
    WA.ui.removeBubble();
})
