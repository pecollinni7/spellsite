const fs           = require('fs');
const Path         = require('path');
const filesas        = require('./files');
const imagesPath   = filesas.path_images;
const itemsPerPage = 30;

let data = filesas.getDataFile();

let Pages = [];
let Files;

function generatePagination()
{
	let res = "";
	// let pagLength = 0;
	res += "<li><a class='page-link' onmousedown='callPrevPage(this)'>&#9664;</a></li>";
	
	// if (Files !== undefined && Files.length > 0) {
	// 	pagLength = Math.ceil(Files.length / itemsPerPage);
	// }
	
	for (let i = 0; i < Pages.length; i++) {
		res += "<li><a class='page-link' onmousedown='setActivePage(this)'>" + i + "</a></li>";
	}
	
	res += "<li><a class='page-link' onmousedown='callNextPage(this)'>&#9654;</a></li>";
	
	return res;
}


exports.generateContent = function (activeFilterTagList) {
	
	let res       = "";
	let pages     = [];
	let fileNames = [];
	
	if (activeFilterTagList !== undefined && activeFilterTagList.length > 0) {
		fileNames = getFileNamesFiltered(activeFilterTagList);
	} else {
		fileNames = getFileNamesAll();
	}

	//build html pages
	for (let i = 0; i < fileNames.length; i++) {
		// const name = Path.basename(fileNames[i]);
		const name      = fileNames[i].split(/[\\/]/).pop();
		const extension = Path.extname(fileNames[i]);
		// const path      = '../../storage/media/' + name;
		// const path      = Path.resolve(imagesPath + '/' + name);
		const path      = imagesPath + '/' + name;

		if (fs.existsSync(path)) {
			console.log('exists: ' + path);
			res += generateHtmlForType(path , name, extension);

		} else {
			// console.error('unexisted: ' + pathSys);
		}


		if ((i + 1) % itemsPerPage === 0) {
			pages.push(res);
			res = "";
		}

		if (i + 1 === fileNames.length) {
			if (i + 1 % itemsPerPage !== 0) {
				pages.push(res);
				res = "";
			}
		}
	}

	Pages = pages;
	exports.setActiveContent();
	setPagination();
	
};

function getFileNamesAll()
{
	return Object.keys(data);
}

function getFileNamesFiltered(filterList)
{
	data = filesas.getDataFile();
	let res = [];

	for (const k in data) {
		for (let i = 0; i < filterList.length; i++) {
			if (data[k].hasOwnProperty('tags') !== false) {
				if (data[k]['tags'].hasOwnProperty(filterList[i])) {
					if (data[k]['tags'][filterList[i]] === 1) {
						if (res.indexOf(k) === -1) {
							res.push(k);
						}
					}
				}
			}

		}
	}

	return res;
}


/*
 exports.generateContent = function (activeFilterTagList=null) {
 let files = [];
 let res = "";
 let pages = [];
 
 
 // if tags are selected
 if (activeFilterTagList) {
 //get files only for selected tags
 } else {
 files = getAllFiles();
 }
 
 
 //build html pages
 for (let i = 0; i < files.length; i++) {
 const file = files[i];
 const fileRelativePath = '../images/' + Path.basename(file);
 const fileExt = Path.extname(file);
 const fileName = file.split(/[\\/]/).pop();
 
 res += generateHtmlForType(fileRelativePath, fileName, fileExt);
 
 if ((i + 1) % itemsPerPage === 0) {
 pages.push(res);
 res = "";
 }
 
 if (i + 1 === files.length) {
 if (i + 1 % itemsPerPage !== 0) {
 pages.push(res);
 res = "";
 }
 }
 }
 
 Pages = pages;
 exports.setActiveContent();
 setPagination();
 };
 */



function generateHtmlForType(filePath, fileName, fileExt)
{
	filePath = encodeURI(filePath);
	
	let res;
	switch (fileExt) {
		case ".gif":
		case ".jpg":
		case ".png":
			res = "<img class='image' src='" + filePath +
				  "' onmousedown='handleItemClick(this)' data-fileName='" + fileName +
				  "' ondblclick='handleItemDoubleClick(this)' data-fileName='" + fileName +
				  "'>";
			return res;
		
		case ".avi":
			// res = "";
			// res += "<video width=" + 320 + " height=" + 240 + " controls>";
			// res += "<source src=" + filePath + " type='video/mp4'>";
			// res += "</video>";
			return res;
		
		case ".flv":
			// res = "";
			// res += "<video width=" + 320 + " height=" + 240 + " controls>";
			// res += "<source src=" + filePath + " type='video/mp4'>";
			// res += "</video>";
			return res;
		
		case ".mpg":
		case ".mp4":
			res = "";
			res += "<video class='videoInsert' onclick='handleItemClick(this)' ondblclick='handleItemDoubleClick(this)' data-fileName='" + fileName + "' autoplay loop muted>";
			res += "<source src=" + filePath + " type='video/mp4'>";
			res += "</video>";
			
			// console.log(res);
			return res;
		
		//TODO: filepath cannot contain blank spaces, bcs its recognized as class
		//TODO: return html block for unsupported fileType
		default:
			return res;
	}
	
}

//TODO make the actual function
module.exports.generateOverlayForType = function generateOverlayForType(filePath)
{
	// var fileName = Path.resolve(filePath);
	// console.log(fileName);
	var fileExt = Path.extname(filePath);
	var fileExtNoDot = fileExt.replace(".", "");
	let res;
	switch (fileExt) {
		case ".gif":
			res = "<div id='gifContent' class='gifContent'>" +
				  "<gif-player class='gifPlayer' src=" + filePath +
				  " size='contain' speed='1' play prerender style='" +
				  "width:"  + ($(document).width() / 100 * 70) + "px; " +
				  "height:" + ($(document).height() / 100 * 50) + "px; " +
				  "position: center; display: block'>" +
				  "</div>";
			return res;
		
		case ".jpg":
		case ".png":
			return res;
			
			// res = "";
			// res += "<video width=" + 320 + " height=" + 240 + " controls>";
			// res += "<source src=" + filePath + " type='video/mp4'>";
			// res += "</video>";
			// return res;
		
		case ".flv":
			// res = "";
			// res += "<video width=" + 320 + " height=" + 240 + " controls>";
			// res += "<source src=" + filePath + " type='video/mp4'>";
			// res += "</video>";
			return res;
		
		case ".avi":
		case ".mpg":
		case ".mp4":
			res = "";
			res += "<video class='videoOverlay' id='videoOverlay' autoplay loop muted>";
			res += "<source id='videoSource' src=" + filePath + " type='video/" + fileExtNoDot + "'>";
			res += "</video>";
			
			console.log(res);
			return res;
		
		//TODO: filepath cannot contain blank spaces, bcs its recognized as class
		//TODO: return html block for unsupported fileType
		default:
			return res;
	}
};

// function returnFiles(dir, files_)
function returnFiles(dir)
{
	// files_ = files_ || [];
	// const files = fs.readdirSync(dir);
	// for (const i in files) {
	// 	const name = dir + '/' + files[i];
	// 	if (fs.statSync(name).isDirectory()) {
	// 		returnFiles(name, files_);
	// 	} else {
	// 		files_.push(name);
	// 	}
	// }
	//
	// files.sort(sortFunction);
	// return files_;
	Files = [];
	
	fs.readdirSync(dir, function (err, files) {
		//handling error
		if (err) {
			return console.log('Unable to scan directory: ' + err);
		}
		//listing all files using forEach
		files.forEach(function (file) {
			// Do whatever you want to do with the file
			// console.log(file);
			Files.push(file);
		});
	});
	Files.sort(sortFunction);
	return Files;
}

const walkSync = function (dir, fileList) {
	
	if (dir[dir.length - 1] !== '/') dir = dir.concat('/')
	
	const files = fs.readdirSync(dir);
	fileList    = fileList || [];
	files.forEach(function (file) {
		if (fs.statSync(dir + file).isDirectory()) {
			fileList = walkSync(dir + file + '/', fileList);
		} else {
			fileList.push(dir + file);
		}
	});
	return fileList;
};

function sortFunction(a, b)
{
	const dateA = a.mtime;
	const dateB = b.mtime;
	return dateA > dateB ? 1 : -1;
}

function getAllFiles()
{
	Files = walkSync(imagesPath);
	return Files;
}

exports.setActiveContent = function (pageNum = 0) {
	document.getElementById('content').innerHTML = Pages[pageNum];
};

function setPagination()
{
	document.getElementById('pagination').innerHTML = generatePagination();
}

// module.exports = {
// 	generateOverlayForType
// };

