<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BGS - Form Manager</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css" />
    <link rel="stylesheet" href="/warehouse/css/main.css">
    <link rel="stylesheet" type="text/css" href="css/builder.css">
    <link rel="stylesheet" href="/warehouse/css/ui.css">
</head>
<style>

    .dashboard-page {
        color: #0093ff;
    }

a {
        text-decoration: none !important;
    }


.form-check-input:disabled~.form-check-label, .form-check-input[disabled]~.form-check-label {
    cursor: default;
    opacity: 1;
    color: #525252;
}

.builder-header {
    margin: 0 auto;
    color: white;
    font-size: 30px;
    margin-top: 20px;
    margin-bottom: 20px;
    font-family: monospace;
}

.formdisplaywrapper {
  background: rgb(221, 221, 221);
  margin: auto;
  width: 50%;
  border-radius: 5px;
  margin-top: 30px;
  margin-bottom: 50px;
}

.formdisplay {
  width: 90%;
  margin: auto;
}

.actual-form {
  margin-top: 30px;
  margin-bottom: 30px;
  word-break: break-word;
}

.form-component select {
  margin-bottom: 10px;
}

#loadFormButton {
  padding: 10px 15px;
  background-color: #2f6384;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 200px;
  margin: 0 auto;
}

.actual-form h2 {
  text-align: center
}

.input-type-label {
  display: none;
  background-color: rgb(171 171 171) !important;
  color: #0c0c0c;
}

.lb2 {
  display: initial;
}

        .form-list {
            max-height: 400px;
            overflow-y: auto;
            margin-top: 18px;
            margin-bottom: 30px;
        }
        .form-viewer {
            background: rgb(248 248 248);
            border-radius: 5px;
            padding: 20px;
            margin-top: 20px;
            box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
            margin-bottom: 20px;
        }
        .form-content {
            padding-left: 20px;
            padding-right: 20px;
            border-radius: 5px;
        }


        .delete-checkbox {
            display: none;
            margin-right: 10px;
        }
        #deleteButton, #cancelDeleteButton {
            display: none;
            margin-top: 10px;
        }

        #toggleDeleteMode {
            position: absolute;
            top: 0px;
            right: 0px;
            background: #e0e0e0;
            color: #585858;
            border: 1px solid #8f8f8f;
        }

        #toggleDeleteMode:hover {
            background: #d4d4d4;
        }

        #toggleDeleteMode:active {
            background: #b8b8b8;
        }

        .list-group-item {
            padding: 0;
            position: relative;
        }

        .list-group-item a {
            display: block;
            padding: 0.75rem 1.25rem;
            color: #535353;
            text-decoration: none;
        }

        .list-group-item:hover {
            background-color: #f8f9fa;
        }

        .delete-checkbox {
            position: absolute;
            left: 10px;
            top: 14px;
            z-index: 1;
        }

        .list-group-item.delete-mode a {
            padding-left: 2.5rem;
        }

        .list-group-item input[type="checkbox"] {
            position: absolute;
        }

        .process-view-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
        }

        .process-view-content {
            background-color: #fefefe;
            margin: 2% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 800px;
            transition: height 0.5s ease-in-out;
            overflow: visible;
            position: relative;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            min-height: 450px; 
        }

        .process-view-navigation {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .process-view-navigation button {
            padding: 10px 20px;
        }

        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }

        .close:hover,
        .close:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
        }

#processViewContainer {
    flex-grow: 1;
    position: relative;
    overflow: hidden;
}



.process-view-navigation {
    position: sticky;
    bottom: 0;
    background-color: #fff;
    padding: 10px 0;
    margin-top: auto;
}

 
        .slide-content {
            position: absolute;
            width: 100%;
            transition: transform 0.3s ease-in-out;
        }

        .slide-left-enter {
            transform: translateX(100%);
        }

        .slide-left-enter-active {
            transform: translateX(0%);
        }

        .slide-left-exit {
            transform: translateX(0%);
        }

        .slide-left-exit-active {
            transform: translateX(-100%);
        }

        .slide-right-enter {
            transform: translateX(-100%);
        }

        .slide-right-enter-active {
            transform: translateX(0%);
        }

        .slide-right-exit {
            transform: translateX(0%);
        }

        .slide-right-exit-active {
            transform: translateX(100%);
        }

        .yes-no-question {
            text-align: center;
        }

    .yes-no-container {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
    }

    .yes-no-container .form-check {
        width: 120px;
        height: 60px;
        border: 2px solid #ccc;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .yes-no-container .form-check:hover {
        background-color: #f0f0f0;
    }

    .yes-no-container .form-check-input {
        display: none;
    }

    .yes-no-container .form-check-label {
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
    }

    .form-check.selected-yes {
    background-color: #579bff !important;
}

.form-check.selected-no {
    background-color: #579bff !important;
}

.form-check.selected-yes .form-check-label,
.form-check.selected-no .form-check-label {
    color: white;
}

          #processViewModal .actual-form {
            max-width: 90%;
            margin: auto;
            text-align: center;
          }

          .progress-container {
            width: 100%;
            background-color: #f3f3f3;
            border-radius: 13px;
            margin-bottom: 20px;
        }

        .progress-bar {
            width: 0;
            height: 12px;
            background-color: #f8a441;
            border-radius: 13px;
            transition: width 0.3s ease-in-out;
        }

        .slide-counter {
            text-align: center;
            margin-bottom: 10px;
            font-size: 16px;
        }


    .form-check.selected-yes .form-check-label {
    color: white;
    }

    .form-check.selected-no .form-check-label {
    color: white;
    }

    .navbar-expand-lg .navbar-collapse {
        display: contents !important;
    }

   .btn-primary {
    background-color: #ffa844;
    border: none;
}

.btn-primary:hover {
    background-color: #d78221;
}

.btn-primary:active {
    background-color: #b66a13 !important;
}

.btn-primary:focus {
    background-color: #b66a13;
}

.modal-body .list-group-item {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #3c3c3c;
    cursor: pointer;
}

.modal-body .list-group-item:hover {
    background: #ebebeb;
}

.modal-body .list-group-item:active {
    background: #cdcdcd;
}

.submission-wrapper {
    border: 1px solid #a2a2a2;
    padding: 50px;
    position: relative;
    border-radius: 12px;
    margin-bottom: 100px;
    width: 50%;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; 
}

.alert-info {
    background: #4d8fe6;
    color: white;
    border: 1px solid #a2a2a2;
    margin-right: -51px;
    margin-top: -21px !important;
    margin-bottom: 0px !important;
    padding: 10px;
    padding-top: 8px;
    padding-bottom: 8px;
    border-top-right-radius: 11px;
    font-size: 12px;
    border-bottom-right-radius: 0px;
    border-top-left-radius: 0px;
}

.container-wrapper {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    margin-top: -30px;
}

.file-preview i {
    font-size: 48px;
    color: #6c757d;
}

.file-label {
    display: none;
}

.document-upload-marker .file-upload-wrapper {
    flex-direction: column-reverse;
}

.img-fluid {
    margin: auto;
    border-radius: 8px;
}



.file-icon {
    width: 48px;
    height: 48px;
    background-size: contain;
    background-repeat: no-repeat;
    display: inline-block;
    margin-right: 10px;
}

.file-icon-default { background-image: url('/formbuilder/icons/default-icon.png'); }
.file-icon-pdf { background-image: url('/formbuilder/icons/pdf-icon.png'); }
.file-icon-word { background-image: url('/formbuilder/icons/word-icon.png'); }
.file-icon-excel { background-image: url('/formbuilder/icons/excel-icon.png'); }
.file-icon-powerpoint { background-image: url('/formbuilder/icons/powerpoint-icon.png'); }
.file-icon-text { background-image: url('/formbuilder/icons/text-icon.webp'); }
.file-icon-image { background-image: url('/formbuilder/icons/image-icon.png'); }
.file-icon-audio { background-image: url('/formbuilder/icons/audio-icon.png'); }
.file-icon-video { background-image: url('/formbuilder/icons/video-icon.png'); }
.file-icon-archive { background-image: url('/formbuilder/icons/archive-icon.png'); }
.file-icon-code { background-image: url('/formbuilder/icons/code-icon.png'); }

.file-preview {
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
}

.file-name {
    font-size: 14px;
    margin-left: 10px;
}

.file-download-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    transition: 0.1s ease;
}

.file-download-link:hover {
	transform: scale(1.03);
}

#documentViewerModal .modal-dialog {
        max-width: 90%;
        height: 90vh;
        margin: 20px auto;
    }

    #documentViewerModal .modal-content {
        height: 100%;
    }

    #documentViewerModal .modal-body {
        height: calc(100% - 56px);
        padding: 0;
    }

    #documentViewer {
        width: 100%;
        height: 100%;
        border: none;
    }

</style>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Form Manager</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav navigation-class">
                    <li class="nav-item dropdown user-menu d-none">
                        <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <span id="userFirstName"></span>
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="userDropdown">
                            <li><a class="dropdown-item" href="#" id="logoutButton">Logout</a></li>
                            <li><a class="dropdown-item" href="#">Settings</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
    </nav>
<div id="navbar"></div>
</div>
<div class="modal fade" id="documentViewerModal" tabindex="-1" aria-labelledby="documentViewerModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="documentViewerModalLabel">Document Viewer</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <iframe id="documentViewer" src=""></iframe>
                </div>
            </div>
        </div>
    </div>
    <div class="container mt-5 submission-wrapper">
        <div id="formContainer"></div>
    </div>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script src="/warehouse/js/ui.js"></script>
<script src="js/login-state.js"></script>
<script src="js/user-auth.js"></script>
<script src="js/view-submission.js"></script>
</body>
</html>