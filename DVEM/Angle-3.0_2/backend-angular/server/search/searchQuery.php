<?php
function recursive_implode(array $array, $glue = ',', $include_keys = false, $trim_all = true)
{
    $glued_string = '';
    // Recursively iterates array and adds key/value to glued string
    array_walk_recursive($array, function($value, $key) use ($glue, $include_keys, &$glued_string)
    {
        $include_keys and $glued_string .= $key.$glue;
        $glued_string .= $value.$glue;
    });
    // Removes last $glue from string
    strlen($glue) > 0 and $glued_string = substr($glued_string, 0, -strlen($glue));
    // Trim ALL whitespace
    $trim_all and $glued_string = preg_replace("/(\s)/ixsm", '', $glued_string);
    return (string) $glued_string;
}

$request = json_decode(file_get_contents("php://input"), true);
if (isset($request['data']) && $request["data"] == "getData" ) {

    try {
        $conn = require_once '../connect.php';
        $queryFlag = false;
        // Various steps of search queries:

        if ( $request["typeOfStudy"] )
        {
            $varTypeOfStudy = $request["typeOfStudy"];
            // Get Study Type ID:

            $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
            $typeOfStudySQLQuery = $conn->prepare("SELECT SM.ID FROM dvem_v01.studytypemaster as SM where SM.StudyName IN ($varTypeOfStudy) ");
            $typeOfStudySQLQuery->execute();

            $typeOfStudyResult = recursive_implode($typeOfStudySQLQuery->fetchAll(PDO::FETCH_ASSOC));
            $queryFlag = true;
        }
        if ( $request["typeOfSpecies"] ){

            $varTypeOfSpecies = $request["typeOfSpecies"];
            $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
            $TypeOfSpeciesSQLQuery = $conn->prepare("SELECT SP.SpeciesID FROM dvem_v01.speciesmaster as SP where SP.speciesName IN ($varTypeOfSpecies) ");
            $TypeOfSpeciesSQLQuery->execute();

            $varTypeOfSpeciesResult = recursive_implode($TypeOfSpeciesSQLQuery->fetchAll(PDO::FETCH_ASSOC));
            $queryFlag = true;
        }
        if ( $request["typeOfSpeciality"] ) {

            $varTypeOfSpeciality = $request["typeOfSpeciality"];
            $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
            $TypeOfSpecialitySQLQuery = $conn->prepare("SELECT SM.SpecialityID FROM dvem_v01.specialitymaster as SM where SM.SpecialityName IN ($varTypeOfSpeciality) ");
            $TypeOfSpecialitySQLQuery->execute();

            $varTypeOfSpecialityResult = recursive_implode($TypeOfSpecialitySQLQuery->fetchAll(PDO::FETCH_ASSOC));
            $queryFlag = true;
        }

        if ($queryFlag) {
            // Now that we know what options have been passed from the search query, lets use them to create a sql statement:
            $sql = "select id, PrimaryAuthors as primary_authors, PrimaryTitle as primary_title, PubYear as pub_year from primarystudiesheader as PH where ";

            if ($typeOfStudyResult) {
                $sql = $sql . "PH.StudyTypeMasterID IN ('" . $typeOfStudyResult . "')";
            }
            if ($varTypeOfSpeciesResult) {
                $sql = $sql . " AND ";
                $sql = $sql . "PH.SpeciesMasterID IN ('" . $varTypeOfSpeciesResult . "')";
            }
            if ($varTypeOfSpecialityResult) {
                $sql = $sql . " AND ";
                $sql = $sql . "PH.SpecialityHeaderID IN ( select SH.specialityheaderid from specialityheader as SH JOIN specialitylines as SL
                    where SH.specialityheaderid = SL.specialityheaderid && SL.SpecialityMasterID
                    IN ( '" . $varTypeOfSpecialityResult . "')) group by SH.specialityheaderid)";
            }
            if ($request["searchText"]) {

                $sql = $sql . " AND ";
                $sql = $sql . " MATCH(`Keywords`,`FullPeriodical`,`PrimaryTitle`,`PrimaryAuthors`,`Abstract`,`SecondaryTitle`, `SecondaryAuthors` , `TertiaryAuthors` , `QuaternaryAuthors`, `QuinaryAuthors`)
                    AGAINST ('" . $request["searchText"] . "');";
            }

            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $searchQuery = $conn->prepare($sql);
        }
        else{
            // If search text is present
            if ( $request["searchText"]) {
                $searchValue = $request["searchText"];

                // Now that we know what options have been passed from the search query, lets use them to create a sql statement:
                $sql = "select id, PrimaryAuthors as primary_authors, PrimaryTitle as primary_title, PubYear as pub_year, SpecialityType as species_type, StudyType as study_type, FullPeriodical as journal_name from primarystudiesheader as PH where ";
                $sql = $sql . " MATCH(`Keywords`,`FullPeriodical`,`PrimaryTitle`,`PrimaryAuthors`,`Abstract`,`SecondaryTitle`, `SecondaryAuthors` , `TertiaryAuthors` , `QuaternaryAuthors`, `QuinaryAuthors`)
                    AGAINST ('" . $request["searchText"] . "');";

                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $searchQuery = $conn->prepare($sql);
            }
            // If search text is not present
            else{
                    $searchValue = $request["searchText"];

                    // Now that we know what options have been passed from the search query, lets use them to create a sql statement:
                    $sql = "select id, PrimaryAuthors as primary_authors, PrimaryTitle as primary_title, PubYear as pub_year, SpecialityType as species_type, StudyType as study_type, FullPeriodical as journal_name from primarystudiesheader as PH";
                    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    $searchQuery = $conn->prepare($sql);
            }
        }

        if ($searchQuery->execute()){
            $searchQueryResult = ($searchQuery->fetchAll(PDO::FETCH_ASSOC));
            echo json_encode($searchQueryResult);
        }

    } catch (PDOException $e) {
        echo 'Error: '. $e->getMessage();
    }
}
else
    echo "error";
?>