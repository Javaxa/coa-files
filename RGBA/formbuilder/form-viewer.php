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
    <link rel="stylesheet" href="/RGBA/warehouse/css/main.css">
    <link rel="stylesheet" type="text/css" href="css/builder.css">
    <link rel="stylesheet" type="text/css" href="css/viewer.css">
    <link rel="stylesheet" href="/RGBA/warehouse/css/ui.css">
</head>
<style>

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
    <div id="processViewModal" class="process-view-modal">
        <div class="process-view-content">
            <span class="close">&times;</span>
            <div class="slide-counter">Step <span id="currentSlide">1</span> of <span id="totalSlides"></span></div>
            <div class="progress-container">
                <div class="progress-bar" id="progressBar"></div>
            </div>
            <div id="processViewContainer"></div>
            <div class="process-view-navigation">
                <button id="prevStep" class="btn btn-secondary">Previous</button>
                <button id="nextStep" class="btn btn-primary">Next</button>
            </div>
        </div>
    </div>

    <div id="navbar"></div>
</div>

    <div class="container mt-5">
        <div class="row">
            <div class="col-md-4" style="position: relative;">
                <div class="floaty">
                <h2>Existing Forms</h2>
                <button id="toggleDeleteMode" class="btn mb-3">Delete</button>
                <button id="deleteButton" class="btn btn-danger">Delete Selected</button>
                <button id="cancelDeleteButton" class="btn btn-secondary">Cancel</button>
                <div class="form-list list-group">
                    <?php
                    $formsDir = __DIR__ . '/forms/';
                    $forms = glob($formsDir . '*.txt');

                    foreach ($forms as $form) {
                        $formContent = json_decode(file_get_contents($form), true);
                        $formName = $formContent['formName'] ?? basename($form, '.txt');
                        $formId = $formContent['formId'] ?? '';
                        echo '<div class="list-group-item">';
                        echo '<input type="checkbox" class="delete-checkbox" data-form="' . urlencode(basename($form)) . '">';
                        echo '<a href="#" class="form-link" data-form="' . urlencode(basename($form)) . '">' . htmlspecialchars($formName) . ' (ID: ' . htmlspecialchars($formId) . ')</a>';
                        echo '</div>';
                    }
                    ?>
                </div>
                </div>
            </div>
            <div class="col-md-8" style="position: relative;">
            <button id="processViewBtn" class="process-btn btn btn-primary mb-3">Process View</button>
            <button id="viewSubmissionsBtn" class="process-btn btn btn-primary mb-3">View Submissions</button>
                <h2>Form Viewer</h2>
                <div class="form-viewer">
                    <div class="form-content" id="formDisplayContainer"></div>
                
                </div>
                <button type="submit" class="btn btn-primary mb-3" id="submitForm" style="float: right;">Submit Form</button>
            </div>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  <script src="js/login-state.js"></script>
  <script src="js/user-auth.js"></script>
  <script src="/RGBA/warehouse/js/ui.js"></script>
  <script src="js/formviewer.js"></script>
</body>
</html>