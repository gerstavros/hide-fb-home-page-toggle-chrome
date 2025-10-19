/*
 * Hide Facebook Home Page Extension
 * Copyright (C) 2025 Stavros G.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

function isFacebookHome(url) {
  try {
    const u = new URL(url);
    return (
      u.hostname === "www.facebook.com" &&
      (u.pathname === "/" || u.pathname === "")
    );
  } catch (e) {
    return false;
  }
}

// when pressing the button
chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get(["feedBlockerEnabled"], (result) => {
    let enabled = !result.feedBlockerEnabled;
    chrome.storage.local.set({ feedBlockerEnabled: enabled });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    }, () => {
      chrome.tabs.sendMessage(tab.id, {
        action: enabled ? "enable" : "disable"
      });
    });
  });
});

// when refreshing tab
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (
    info.status === "complete" &&
    isFacebookHome(tab.url)
  ) {
    chrome.storage.local.get(["feedBlockerEnabled"], (result) => {
      if (result.feedBlockerEnabled) {
        chrome.scripting.executeScript({
          target: { tabId },
          files: ["content.js"]
        }, () => {
          chrome.tabs.sendMessage(tabId, { action: "enable" });
        });
      }
    });
  }
});
