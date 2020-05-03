$(document).ready(main);

function main() {		

  var $selectedImperial = $("#selectedImperial"),
    $selectedMetric = $("#selectedMetric"),
    $PanelInfoOne = $("#PanelInfoOne"),
    $PanelInfoTwo = $("#PanelInfoTwo"),
    $PanelInfoThree = $("#PanelInfoThree"),
    $btnOne = $("#btnOne"),
    $btnTwo = $("#btnTwo"),
    $btnThree = $("#btnThree"),
		$calculator = $(".calculator"),
    $btnCalculate = $("#btnCalculate"),
    $boxCalculateResults = $("#boxCalculateResults"),
    $weight = $("#weight"),
    $heightInput = $("#heightInput"),
    $InHeightInput = $("#InHeightInput"),
    $age = $("#age"),
    $slider = $("#slider"),
    $weightGoal = $("#weightGoal"),
    IsImperial = true;
		
  // expand or collapse the descriptions
  $PanelInfoOne.on("shown.bs.collapse", function() {
    $btnOne.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
  });
  $PanelInfoOne.on("hidden.bs.collapse", function() {
    $btnOne.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
  });
  $PanelInfoTwo.on("shown.bs.collapse", function() {
    $btnTwo.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
  });
  $PanelInfoTwo.on("hidden.bs.collapse", function() {
    $btnTwo.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
  });
  $PanelInfoThree.on("shown.bs.collapse", function() {
    $btnThree.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
  });
  $PanelInfoThree.on("hidden.bs.collapse", function() {
    $btnThree.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
  });

  // only allow numerical input in the text fields
  $("input[type='text']").keypress(digitsOnly);

  // slider control
  $slider.slider({
    min: 0,   max: 2.5,   value: 1,   step: 0.1,
    slide: function(event, ui) {
      // updates text when the slider gets moved
      if (IsImperial)
        $weightGoal.text(ui.value + " pounds");
      else
        $weightGoal.text(ui.value + " kilograms");
    }
  });
	
  changeUOM(); 
	// when tab is clicked it changes labels
  $selectedMetric.click(function() {
    IsImperial = false;
    changeUOM();
  });
  $selectedImperial.click(function() {
    IsImperial = true;
    changeUOM();
  });
  // calculates when clicked
  $btnCalculate.click(calculate); 

  // shows results
  function calculate() {
    if (validateInputs()) {
      if ($age.val() > 110) {
        $boxCalculateResults.removeClass("hidden").html("<span style='color:red'>Invalid Age</span>");
      } else if (($weight.val() > 600 && IsImperial) || ($weight.val() > 270 && !IsImperial)) {
        $boxCalculateResults.removeClass("hidden").html("<span style='color:red'>Invalid Weight</span>");
        //if IsImperial is selected
      } else if (IsImperial) { 
        if ($InHeightInput.val() > 12) {
          inchesConvert();
        }
        var BMR = Math.round(calculateBMR());
        var TDEE = Math.round(calculateBMR() * 1.2);
        var BMI = calculateBMI();
        $boxCalculateResults.removeClass("hidden").html(
          "You need to eat " + Math.round((TDEE - 500 * $slider.slider("value"))) + " calories per day maximum, in order to lose " + $slider.slider("value") + " pounds per week.<br/><br/>BMR: " + BMR + " kcal<br/>TDEE: " + TDEE + " kcal<br/>BMI: " + BMI + "</td><br/><br/>* It is dangerous to eat less than 1200 calories a day."); 
      } else {
        // if metric is selected
        var BMR = Math.round(calculateBMR());
        var TDEE = Math.round(calculateBMR() * 1.2);
        var BMI = calculateBMI();
        $boxCalculateResults.removeClass("hidden").html(
          "You need to eat " + Math.round((TDEE - 1102 * $slider.slider("value"))) + " calories per day maximum, in order to lose " + $slider.slider("value") + " kilograms per week.<br/><br/>BMR: " + BMR + " kcal<br/>TDEE: " + TDEE + " kcal<br/>BMI: " + BMI + "</td><br/><br/>* It is dangerous to eat less than 1200 calories a day."); 
      }
    } else
      $boxCalculateResults.removeClass("hidden").html("<span style='color:red'>Please fill in all fields.</span>");
  }

  // if user selected everything needed
  function validateInputs() {
    if ($("input[type='radio']:checked").val() && $age.val().length > 0 && $weight.val().length > 0 && ($heightInput.val().length > 0 || $InHeightInput.val().length > 0))
      return true;
    else
      return false;
  }

  // if fields are numeric
  function digitsOnly(e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
      return false;
    }
  }

  // BMR
  function calculateBMR() {
    if (IsImperial) {
      var BMR = 4.53592 * $weight.val() + 6.25 * (30.48 * $heightInput.val() + 2.54 * $InHeightInput.val()) - 5 * $age.val()
      if ($("#radio1:checked").val())
        return BMR + 5;
      else
        return BMR - 151;
      return BMR;
    } else {
      var BMR = 10 * $weight.val() + 6.25 * $heightInput.val() - 5 * $age.val();
      if ($("#radio1:checked").val())
        return BMR + 5;
      else
        return BMR - 151;
      return BMR;
    }
  }

  //  BMI
  function calculateBMI() {
    if (IsImperial) {
      var totalIn = 12 * (parseInt($heightInput.val()) || 0) + (parseInt($InHeightInput.val()) || 0);
      var BMI = 703 * ($weight.val() / Math.pow(totalIn, 2));
      BMI = (Math.round(BMI * 10) / 10); // rounds to 1 decimal point
      if (BMI < 18.5)
        return (BMI + " - 'Underweight'");
      else if (BMI >= 18.5 && BMI <= 24.9)
        return (BMI + " - 'Normal'");
      else if (BMI > 24.9 && BMI <= 29.9)
        return (BMI + " - 'Overweight'");
      else
        return (BMI + " - 'Obese'");
      return BMI;
    } else {
      var BMI = $weight.val() / Math.pow($heightInput.val() / 100, 2);
      BMI = (Math.round(BMI * 10) / 10); // rounds to 1 decimal point
      if (BMI < 18.5)
        return (BMI + " - 'Underweight'");
      else if (BMI >= 18.5 && BMI <= 24.9)
        return (BMI + " - 'Normal'");
      else if (BMI > 24.9 && BMI <= 29.9)
        return (BMI + " - 'Overweight'");
      else
        return (BMI + " - 'Obese'");
      return BMI;
    }
  }

  // if input > 12, convert to inches
  function inchesConvert() {
    var newFt = parseInt($heightInput.val()) || 0;
    var newIn = parseInt($InHeightInput.val());
    while (newIn >= 12) {
      newFt++;
      newIn -= 12;
    }
    $heightInput.val(newFt);
    $InHeightInput.val(newIn);
  }

  // system converter
  function changeUOM() {
    if (IsImperial) {
      $weight.attr('placeholder', 'lb').val("");
      $heightInput.closest("div").removeClass("col-xs-6").addClass("col-xs-3");
      $heightInput.attr('placeholder', 'ft').val("");
      $InHeightInput.closest("div").show();
			$InHeightInput.val("");
      $slider.slider({
        min: 0,
        max: 2.5,
        value: 1,
        step: 0.1,
      });
      $weightGoal.text($slider.slider("value") + " lb");
    } else {
      $weight.attr('placeholder', 'kg').val("");
      $heightInput.closest("div").removeClass("col-xs-3").addClass("col-xs-6");
      $heightInput.attr('placeholder', 'cm').val("");
      $InHeightInput.closest("div").hide();
			$InHeightInput.val("");
      $slider.slider({
        min: 0,
        max: 1.15,
        value: 0.45,
        step: 0.05,
      });
      $weightGoal.text($slider.slider("value") + " kg");
    }
  }
	
};
