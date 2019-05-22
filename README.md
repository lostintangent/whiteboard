# Live Share Whiteboard

[![](https://aka.ms/vsls-badge)](https://aka.ms/vsls)

Live Share Whiteboard enhances the existing [Visual Studio Live Share](https://aka.ms/vsls) experience, by enabling you to open an integrated whiteboard, without needing to use a seperate tool or service. All participants within a Live Share session can collaboratively draw on the whiteboard, and see each others changes in real-time. For certain use cases (e.g. technical interviews, mentoring/classrooms), this can provide a useful means of communication, in addition to an [audio call](https://aka.ms/vsls-audio) and co-editing and debugging.

<img width="725px" src="https://user-images.githubusercontent.com/116461/50567457-dddaba00-0cf9-11e9-840b-1b0a984d5ad9.gif" />

This is an experimental extension, and isn't meant to replace existing solutions for creating persistent diagrams. For example, you can already use the [PlantUML](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml) extension today, and synchronize the contents in real-time over Live Share (since it's just a text file + a preview surface). Therefore, the whiteboard is useful for creating ad-hoc/ephemeral drawings/diagrams, that would otherwise be inefficient to create via other means (e.g. UML).

## Getting Started

To begin using the collaborative whiteboard within your Visual Studio Live Share sessions, simply perform the following steps:

1. Install this extension, then reload VS Code.

1. Click the `Live Share` button in your status bar to start a new collaboration session, and invite the developers you'd like to collaborate with.

   <img src="https://aka.ms/vsls/quickstart/share" width="140px" />

   > Make sure the developers you're collaborating with also have the VS Live Share Whiteboard extension installed.

1. Open the Live Share `Session Details` view, and click the `Whiteboard` node in the tree to open the integrated whiteboard.

   <img width="450px" src="https://user-images.githubusercontent.com/116461/50552633-23d94480-0c4c-11e9-8a54-a61d3a5762d5.png" />

1. Begin drawing! When other developers join the session, they can also open up the whiteboard and see the drawing you've done thus far. From there, everyone can contribute to the whiteboard, using the pencil, shapes and text, and see each other changes.

## Known Issues

This is an early/experimental extension, and therefore, has a number of known issues/limitations:

1. If the host closes the whiteboard, then the existing content is lost. Guests can close/re-open the whiteboard, but the host currently can't. If the host does close it, then the whiteboard can still be used and shared, but the previous content will be cleared.

1. The cursor for other participants aren't displayed (like they are within source files).

1. Read-only guests are able to edit the whiteboard, which probably doesn't make sense.

## Credit

This extension is only possible due to the **amazing** [Literally Canvas](http://literallycanvas.com/) library. It powers the entire whiteboard experience, and the drawing syncronization happens over the Live Share secure channel via the [Live Share extensibility API](https://npmjs.com/vsls).

Additionally, the extension's icon is graciously provided by [techawarong on IconFinder](https://www.iconfinder.com/techawarong).
