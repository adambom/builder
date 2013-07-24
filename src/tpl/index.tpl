<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Build Stuff</title>
    <link rel="stylesheet" <% _.each(style, function (value, attri) { %> <%= attri + '="' + value + '"' %><% }); %>>
</head>
<body>
<% _.each(scripts, function (script) { %>
     <script <% _.each(script, function (value, attri) { %> <%= attri + '="' + value + '"' %><% }); %>></script>
<% }); %>
</body>
</html>