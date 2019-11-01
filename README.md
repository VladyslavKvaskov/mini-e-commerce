# mini-e-commerce
Visit https://m-store-calm-uguisu.now.sh/ for the demo!<br>
Visit https://www.facebook.com/vlad.kvaskov/videos/2521147621310383/ to view a video of the demo.


This is a mini e-commerce web app. Here I used only front-end.
There you can see a button "Admin Client," which I use to toggle between admin and client pages.<br><br><br>
On the admin page, you can:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- add new products<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- edit products<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- delete products<br><br><br>
On the client page, you can:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- add products to a cart<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- view products inside of the cart<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- delete products from the cart<br><br>
Also, **notice what happens when you go back and forth in the history by using the browser's arrows.**<br><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;There I created smooth animations using CSS. They are smooth because I animate only such CSS properties as transfrorm and opacity. 
In CSS, it's best to only animate these two properties because when you animate them, the animation will be processed through GPU, so the browser will not have to repaint them. If you animate any other properties, they will be processed through a browser/CPU and they will be repainted.
