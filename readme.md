# Static Pages

The simplest Markdown to HTML generator ever.

I looked for a _cli_ script that could take in a directory of 
Markdown files along with a template file and convert everything 
into some HTML files, but couldn't find one... so I wrote it myself.


### What is it?
This is just a cli script that takes, as an input, a directory of Markdown
file and a template file that wraps around the Markdown content
and then spits out HTML file that can be served via any HTTP server 
(Apache, Nginx, etc...)

### How to install?
Clone and run `$npm install`, that's it.

### How do I...?
The directory structure is up to you, but this how I like to do it:
Create two directories: `markdown` and `view`. Put some Markdown file in the
markdown `directory`. Place a `layout.html` file in the `view` directory that could
look something like this:

```$html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>{{file.title}}</title>
    </head>
    <body>
        <header>
            <h1>My Crazy Blog</h1>
        </header>
        <nav>
            <ul>
                {% for file in menu %}
                <li>
                    <a href="{{file.filename}}">{{file.title}}</a>
                </li>
                {% endfor %}
            </ul>
        </nav>
        <main>
            {{content|safe}}
            {{time.modified|date('Y-m-d')}}
        </main>
    </body>
</html>

```

and then run:
```sh
$ node /path/to/src/index.js -i /path/to/markdown -t /path/to/view/layout.html -o /path/to/www
```
where the `www` directory is what your HTTP server is pointed at.

### More on the `markdown` directory
If the order matters, you can prepend numbers to the filename and the _menu_ will be
ordered accordingly.

The number *1* is special. If the script encounters a file name that starts with 
(any numbers of leading zeros, followed by a) *1*, it will rename that file to `index.html`.
That is to create the entry-point to your blog/web-site. This is assuming that your
web-server is configured to pick up `index.html` if no file-name is specified in the URL.

The Markdown files are converted into HTML via the [remarkable](https://github.com/jonschlinkert/remarkable)
library and then handed off to the layout file.


### More on the `template` file
The template file is where structure of the HTML is defined. There is where you put things that are common
among all the html-pages, like the header and footer etc...

The template files are converted via the [swig](http://node-swig.github.io/swig-templates/) library.
Each file is handed the following JSON object which can then be accessed in the template file:
```
{
    content: '<string>', // the Markdown converted to HTML
    file: {
        title: '<string>', //The title of this file 
        filename: '<string>', // Path to this HTML file
        path: '<string>', // Name of this original MD file
    },
    menu: [{
        title: '<string>', //The title of each file 
        filename: '<string>', // Path to each HTML file
        path: '<string>', // Name of each original MD file
    }],
    time: {
        created: <Date>, // When this HTML was created
        modified: <Date>, // When this HTML was last modified
    }
}
```

### I want Continuous Deployment!
You could run this on your local machine and then FTP the HTML files to your server, that's real old-school.

The way I like to do it is to.

1. Create a git repo that has the `markdown` and `view` directories only.
2. Add a _web-hook_ to that repo that triggers re-generation on the server every time I commit to that repo.
3. Edit my Markdown files in Github's web-view.

#### Server Setup
I have PHP configured on the server, cause I need to run one script (I'm sure this can be done in another way).
Then on the server I have this directory structure:

```
/var
 ├── www            <- that Apache is pointed to
 |    ├── logs.log
 |    ├── hook.sh
 |    └── hook.php 
 ├── my-repo        <- github content repo
 └── static-pages   <- this repo
```

In Github, go into **Settings / Webhooks** for the _content-repo_ and add a web-hook pointing 
to `http://my-crazy-blog.com/hook.php`

My `hook.php` looks like this:
```php
<?php
$retval = 0;
system('./hook.sh', $retval);
var_dump($retval);
```

This is just calling a Bash script that look like this:
```sh
#!/bin/bash

cd /var/my-repo && \
git pull origin master >> /var/www/logs.log && \
cd /var/static-generator/src && \
node index.js -i /var/my-repo/markdown -t /var/my-repo/view/layout.html -o /var/www & \
    >> /var/www/logs.log
```

The script is first going into the _content-repo_ and fetching the *master* from Github,
then it goes into the **static-generator** repo and generates a new set of HTML file, logging
things out along the way.  

And that pretty much it.
