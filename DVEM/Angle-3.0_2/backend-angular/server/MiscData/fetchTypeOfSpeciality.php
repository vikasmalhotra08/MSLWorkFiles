<?php

$request = json_decode(file_get_contents("php://input"), true);
if (isset($request['data']) && $request["data"] == "getData" ) {

    try {
        $conn = require_once '../connect.php';

        $sql = "SELECT SpecialityName
                FROM dvem_v01.specialitymaster;";

        $result = $conn->prepare($sql) or die ($sql);

        if (!$result->execute()) return false;
        if ($result->rowCount() > 0) {
            $json = array();
            while ($row = $result->fetch()) {
                $json[] = array(
                    $row['SpecialityName']
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