<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Jasmine Spec Runner</title>
    <% css.forEach(function(style){ %>
        <link rel="stylesheet" type="text/css" href="<%= style %>">
    <% }) %>
</head>
<body>
    <% with (scripts) { %>
        <% [].concat(polyfills, jasmine, vendor, helpers, src).forEach(function(script){ %>
            <script src="<%= script %>"></script>
        <% }) %>
    <% }; %>
    <% with (options) { %>
            <script src="<%= mantriPath %>" data-require="<%= requirePath %>" data-deps="<%= depsPath %>" data-config="<%= configPath %>"></script>
    <% }; %>
    <% with (scripts) { %>
        <% [].concat(specs, reporters, start).forEach(function(script){ %>
            <script src="<%= script %>"></script>
        <% }) %>
    <% }; %>
</body>
</html>
