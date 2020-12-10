# eLectures@THB REST API
This is the REST API serving semantical information of video lectures for eLectures@THB. You can find out more about it at at [electures.th-brandenburg.de](http://electures.th-brandenburg.de)

## Version: 1.0.0

**Contact information:**  
bmake@th-brandenburg.de  

**License:** [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)

[eLectures@THB on GitHub](https://github.com/bmake/lectures_at_thb)
### /collegeOrUniversity

#### GET
##### Summary:

Returns all university departments

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| Accept-Language | header | language code according to ISO 639-1 | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success! |
| 500 | Internal Server Error! |

### /studyProgram/collegeOrUniversity/{collegeOrUniversityIRI}

#### GET
##### Summary:

Returns all study programs of a given department

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| Accept-Language | header | language code according to ISO 639-1 | Yes | string |
| collegeOrUniversityIRI | path | department abbreviation | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success! |
| 500 | Internal Server Error! |

### /module/studyProgram/{studyProgramIRI}

#### GET
##### Summary:

Returns all modules of a given study program

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| Accept-Language | header | language code according to ISO 639-1 | Yes | string |
| studyProgramIRI | path | study program abbreviation | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success! |
| 500 | Internal Server Error! |

### /videoLecture/module/{moduleIRI}

#### GET
##### Summary:

Returns the local IRIs of all video lectures of a given module

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| moduleIRI | path | module abbreviation | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success! |
| 500 | Internal Server Error! |

### /videoLecture/{videoLectureIRI}

#### GET
##### Summary:

Returns all information about a given video lecture

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| Accept-Language | header | language code according to ISO 639-1 | Yes | string |
| videoLectureIRI | path | video lecture abbreviation | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Query successful! |
| 500 | Internal Server Error! |

### /videoLecture/{videoLectureIRI}/videoObjects

#### GET
##### Summary:

Returns information about all sections of a a given video lecture

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| Accept-Language | header | language code according to ISO 639-1 | Yes | string |
| videoLectureIRI | path | video lecture abbreviation | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Query successful! |
| 500 | Internal Server Error! |

### /vimeo/{videoID}

#### GET
##### Summary:

Returns infomation of given vimeo video

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| videoID | path | video ID from Vimeo | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Query successful! |
| 500 | Internal Server Error! |

### Models


#### VideoLecture

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| iri | string |  | Yes |
| description | string |  | Yes |
| about | string |  | Yes |
| headline | string |  | Yes |
| language | string |  | Yes |
| thumbnail | string |  | Yes |
| url | string |  | Yes |
| duration | integer |  | Yes |
| creator | string |  | Yes |

#### CollegeOrUniversity

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| iri | string |  | Yes |
| name | string |  | Yes |

#### StudyProgram

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| iri | string |  | Yes |
| name | string |  | Yes |

#### Module

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| iri | string |  | Yes |
| name | string |  | Yes |

#### VideoObject

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| headline | string |  | Yes |
| url | string |  | Yes |
| duration | long | duration in seconds | Yes |
| videoSharingPlatform | string |  | Yes |
| lecturerVideoID | string | id of the lecturer video on respective platform | Yes |
| screencastVideoID | string | id of the screencast video on respective platform | Yes |

#### VimeoVideo

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| quality | string |  | Yes |
| url | string |  | Yes |
| thumbnail | string |  | Yes |