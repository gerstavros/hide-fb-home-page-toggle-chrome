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

function isFacebookHome() {
  try {
    const url = new URL(window.location.href);
    return (
      url.hostname === "www.facebook.com" &&
      (url.pathname === "/" || url.pathname === "")
    );
  } catch (e) {
    return false;
  }
}

function hideFeed() {
  if (!isFacebookHome()) return;

  document.querySelectorAll('[role="feed"], [role="region"]').forEach(el => {
    el.style.display = "none";
  });
}

function showFeed() {
  document.querySelectorAll('[role="feed"], [role="region"]').forEach(el => {
    el.style.display = "";
  });
}

function applyIfEnabled() {
  chrome.storage.local.get(["feedBlockerEnabled"], (result) => {
    if (result.feedBlockerEnabled) {
      hideFeed();
    }
  });
}

applyIfEnabled();

let lastUrl = location.href;

const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(applyIfEnabled, 300);
  }
});

observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "enable") {
    hideFeed();
  } else if (message.action === "disable") {
    showFeed();
  }
});
