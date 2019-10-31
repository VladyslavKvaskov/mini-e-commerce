# mini-e-commerce
This is a mini e-commerce web app. Here I used only front-end.
There you can see a button "Admin Client," which I use to toggle between admin and client pages. 
<br/>
On the admin page, you can:<br/>
      -add new products<br/>
      -edit products<br/>
      -delete products<br/>
<br/>
On the client page, you can:<br/>
      -add products to a cart<br/>
      -view products inside of the cart<br/>
      -delete products from the cart<br/>
 <br/>
 Also, notice what happens when you go back and forth in the history by using the browser's arrows.
 <br/>
 There I created smooth animations using CSS. They are smooth because I animate only such CSS properties as transfrorm and opacity. 
 In CSS, it's best to only animate these two properties because when you animate them, the animation will be processed through GPU, so the browser will not have to repaint them.
 If you animate any other properties, they will be processed through a browser/CPU and they will be repainted.
