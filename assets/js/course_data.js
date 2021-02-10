---
languages: ["en"]
---

var courses = [{% for course in site.courses %}{
    code: "{{course.code}}",
    name: "{{course.name}}",
    months_valid: "{{course.months_valid}}",
},{% endfor %}]

function getCourseByName(name) {
    var course = {};
    courses.forEach((item, index, array) => {
        if (item['name'] == name) {
            course = item;
        }
    });
    return course;
}

function getCourseByCode(code) {
    var course = {};
    courses.forEach((item, index, array) => {
        if (item['code'] == code) {
            course = item;
        }
    });
    return course;
}