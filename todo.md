# Project TODO List

This file tracks the major issues and tasks for the Salasel 2.0 project.

## High Priority

- **[BUG]** Video does not load on initial client-side navigation to the playlist page. It only works after a hard reload. This is likely a component mounting or initialization issue with the video player.
- **[REFACTOR]** The overall HTML layout and CSS for the playlist page needs to be reviewed and fixed to match the design.
- **[FEATURE]** Implement video selection functionality in the `PlaylistSidebar`. Clicking a video in the list should change the video playing in the `VideoPlayer`.
- **[FEATURE]** Implement the tab-switching logic and placeholder UI for the `VideoDetailsTabs` component (Search, Summary, Transcription).
- **[FEATURE]** Ensure basic video player functionalities (play, pause, seek, volume) are working correctly with the chosen library.

## Medium Priority
- **[BUG]** Debug image loading indicator (spinner/shimmer) not appearing on `SelectedPlaylistCard`. The `onLoad` event or a styling/stacking issue might be preventing the loading state from being visible.

- adjust the grid elements on the playlist/id/videoid/page.tsx page. problem is that the sidebar height is flexible which causes the bottom grid element to not fill the entire width for some reason.
- make the continue watching button take you to the latest watch video (right now its set to the first video, later remove that logic once you implement the localstorage progress)
- add a localstroage to save up the user's playlist progress

