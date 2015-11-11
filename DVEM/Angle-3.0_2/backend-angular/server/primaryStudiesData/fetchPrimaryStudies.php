<?php

$request = json_decode(file_get_contents("php://input"), true);
if (isset($request['data']) && $request["data"] == "getData" ) {

    try {
        $conn = require_once '../connect.php';

        $sql = "SELECT ID, RefType, recordDate, PrimaryAuthors, PrimaryTitle, FullPeriodical, PeriodicalAbbrev,
                    PubYear, PubDate, Volume, Issue, StartPage, OtherPage, Keywords, Abstract, Notes, PersonalNotes, SecondaryAuthors, SecondaryTitle, Edition,
                    Publisher, PlacePub, TertiaryAuthors, QuaternaryAuthors, QuinaryAuthors, TertiaryTitle, ISSN, Availability, Address, AccNumber,
                    Language,Classification, SubFile, OrgForiegnTitle, url, DOI, CallNumber, `Database`, DataSource, IdentPhrase, DVemNumber
                FROM dvem_v01.primarystudiesheader;";

        $result = $conn->prepare($sql) or die ($sql);

        if (!$result->execute()) return false;
        if ($result->rowCount() > 0) {
            $json = array();
            while ($row = $result->fetch()) {
                $json[] = array(
                    'ID' => $row['ID'],
                    'RefType' => $row['RefType'],
                    'recordDate' => $row['recordDate'],
                    'PrimaryAuthors' => $row['PrimaryAuthors'],
                    'PrimaryTitle' => $row['PrimaryTitle'],
                    'FullPeriodical' => $row['FullPeriodical'],
                    'PeriodicalAbbrev' => $row['PeriodicalAbbrev'],
                    'PubYear' => $row['PubYear'],
                    'PubDate' => $row['PubDate'],
                    'Volume' => $row['Volume'],
                    'Issue' => $row['Issue'],
                    'StartPage' => $row['StartPage'],
                    'OtherPage' => $row['OtherPage'],
                    'Keywords' => $row['Keywords'],
                    'Abstract' => $row['Abstract'],
                    'Notes' => $row['Notes'],
                    'PersonalNotes' => $row['PersonalNotes'],
                    'SecondaryAuthors' => $row['SecondaryAuthors'],
                    'SecondaryTitle' => $row['SecondaryTitle'],
                    'Edition' => $row['Edition'],
                    'Publisher' => $row['Publisher'],
                    'PlacePub' => $row['PlacePub'],
                    'TertiaryAuthors' => $row['TertiaryAuthors'],
                    'QuaternaryAuthors' => $row['QuaternaryAuthors'],
                    'QuinaryAuthors' => $row['QuinaryAuthors'],
                    'TertiaryTitle' => $row['TertiaryTitle'],
                    'ISSN' => $row['ISSN'],
                    'Availability' => $row['Availability'],
                    'Address' => $row['Address'],
                    'AccNumber' => $row['AccNumber'],
                    'Language' => $row['Language'],
                    'Classification' => $row['Classification'],
                    'SubFile' => $row['SubFile'],
                    'OrgForiegnTitle' => $row['OrgForiegnTitle'],
                    'url' => $row['url'],
                    'DOI' => $row['DOI'],
                    'CallNumber' => $row['CallNumber'],
                    'Database' => $row['Database'],
                    'DataSource' => $row['DataSource'],
                    'IdentPhrase' => $row['IdentPhrase'],
                    'DVemNumber' => $row['DVemNumber']
                );
            }
            echo json_encode($json);
        }
    } catch (PDOException $e) {
        echo 'Error: '. $e->getMessage();
    }
}
else
    echo "error";
?>