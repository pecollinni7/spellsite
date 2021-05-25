const NotificationManager = require('./NotificationManager');
const Settings = require('./Settings');

//TODO: uninstall parse-md
const parseMD = require('parse-md').default;
const fs = require('fs');


const Parser = require('markdown-parser');



class MDParser
{
    static _parser = new Parser();


    static parse()
    {
        const fileContents = fs.readFileSync('D:\\_WebStorm\\spellsite\\CHANGELOG.md', 'utf8');
        let { metadata, content } = parseMD(fileContents);

        content = content.substring(1, content.length-1);

        let title = content.substring(0, content.indexOf('\n'));
        // console.log('title = ' + title);

        let body = content.substring(content.indexOf('\n'), content.indexOf('---'));
        // console.log(body);
        return [title, body];
    }

    //TODO: setup the changelog file somehow
    static showChangeLogNotification()
    {
        const parsedChangelog = this.parse();
        NotificationManager.addNotification(parsedChangelog[0], parsedChangelog[1], false, true);
    }



}

module.exports = MDParser;
