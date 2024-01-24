How we addressed the following WCAG guidelines:

-   1.1 Text Alternatives: Provide text alternatives for any non-text content so that it can be changed into other forms people need, such as large print, braille, speech, symbols or simpler language.
    -   We address this by giving every img an alt as well as using proper naming for everything so that in the case of a need for a screen reader
        the page is still navigable and accessible.
-   1.3 Adaptable: Create content that can be presented in different ways (for example simpler layout) without losing information or structure.
    -   We address this guideline by creating different layouts of the page depending on the screen size that is used. This means that when the
        webpage is being viewed on a smaller screen, the table (our archive) is presented in a simpler way that fits the screen size and eliminates
        the need for horizontal scrollbars and overall makes the experience more pleasant.
-   1.4 Distinguishable: Make it easier for users to see and hear content including separating foreground from background.
    -   We address this guideline by using font colors that have a strong contrast to the background. We also use font colors that are neutral and fit the page overall while not being necessary to convey information. This results in no discrimination of people that might not be able to see colors we are using as font colors as they do not provide any additional information that is necessary to either understand or navigate the website.
-   2.1 Keyboard Accessible: Make all functionality available from a keyboard.
    -   We address this by not blocking or hiding any information relating to the webpage in any way, except when it is required (such as removing the form functionality from the print view of the webpage).
-   2.4 Navigable: Provide ways to help users navigate, find content, and determine where they are.
    -   We address this by having titles for each section that is logically separate from the other. We also have a section specifically dedicated to the purpose and aim of the website with its appropriate title to make navigation more accessible. Moreover, whenever we do use links (whether the link is internal or external) we use appropriate and understandable naming as well as a different layout of the text so the link stands out and it is understandable that it is a link and what its purpose is.

Addressing Peer Feedback:

1. One point of complaint was the left-alignment since it would be uncomfortable on a big monitor. The suggestion was to have the page centered so it would appear in the center even on very large screens. We agree with this feedback and therefore implemented a center alignment style for the entire page.
2. Another point for improvement was to use more classes as identifiers, which we did do more consistently as we created the dynamic content for the table and grid
3. The banner was not compatible for smaller screen sizes which is why we decided to remove it completely so that it doesn't take away any of the experience if the user is using the website on a device with a smaller screen

Sources Cited:

-   for creating the disappearing form, we used the HTML tag "dialog" and used explanations and sample implementations from the following two sources:

1. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
2. https://www.w3schools.com/tags/tag_dialog.asp
