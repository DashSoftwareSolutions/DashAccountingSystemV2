DO $$
DECLARE
    the_country_id INTEGER;
BEGIN
    -- United States of America
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'US' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'State', 'AL', 'Alabama' )
    ,( the_country_id, 'State', 'AK', 'Alaska' )
    ,( the_country_id, 'State', 'AZ', 'Arizona' )
    ,( the_country_id, 'State', 'AR', 'Arkansas' )
    ,( the_country_id, 'State', 'CA', 'California' )
    ,( the_country_id, 'State', 'CO', 'Colorado' )
    ,( the_country_id, 'State', 'CT', 'Connecticut' )
    ,( the_country_id, 'State', 'DE', 'Delaware' )
    ,( the_country_id, 'State', 'FL', 'Florida' )
    ,( the_country_id, 'State', 'GA', 'Georgia' )
    ,( the_country_id, 'State', 'HI', 'Hawaii' )
    ,( the_country_id, 'State', 'ID', 'Idaho' )
    ,( the_country_id, 'State', 'IL', 'Illinois' )
    ,( the_country_id, 'State', 'IN', 'Indiana' )
    ,( the_country_id, 'State', 'IA', 'Iowa' )
    ,( the_country_id, 'State', 'KS', 'Kansas' )
    ,( the_country_id, 'State', 'KY', 'Kentucky' )
    ,( the_country_id, 'State', 'LA', 'Louisiana' )
    ,( the_country_id, 'State', 'ME', 'Maine' )
    ,( the_country_id, 'State', 'MD', 'Maryland' )
    ,( the_country_id, 'State', 'MA', 'Massachusetts' )
    ,( the_country_id, 'State', 'MI', 'Michigan' )
    ,( the_country_id, 'State', 'MN', 'Minnesota' )
    ,( the_country_id, 'State', 'MS', 'Mississippi' )
    ,( the_country_id, 'State', 'MO', 'Missouri' )
    ,( the_country_id, 'State', 'MT', 'Montana' )
    ,( the_country_id, 'State', 'NE', 'Nebraska' )
    ,( the_country_id, 'State', 'NV', 'Nevada' )
    ,( the_country_id, 'State', 'NH', 'New Hampshire' )
    ,( the_country_id, 'State', 'NJ', 'New Jersey' )
    ,( the_country_id, 'State', 'NM', 'New Mexico' )
    ,( the_country_id, 'State', 'NY', 'New York' )
    ,( the_country_id, 'State', 'NC', 'North Carolina' )
    ,( the_country_id, 'State', 'ND', 'North Dakota' )
    ,( the_country_id, 'State', 'OH', 'Ohio' )
    ,( the_country_id, 'State', 'OK', 'Oklahoma' )
    ,( the_country_id, 'State', 'OR', 'Oregon' )
    ,( the_country_id, 'State', 'PA', 'Pennsylvania' )
    ,( the_country_id, 'State', 'RI', 'Rhode Island' )
    ,( the_country_id, 'State', 'SC', 'South Carolina' )
    ,( the_country_id, 'State', 'SD', 'South Dakota' )
    ,( the_country_id, 'State', 'TN', 'Tennessee' )
    ,( the_country_id, 'State', 'TX', 'Texas' )
    ,( the_country_id, 'State', 'UT', 'Utah' )
    ,( the_country_id, 'State', 'VT', 'Vermont' )
    ,( the_country_id, 'State', 'VA', 'Virginia' )
    ,( the_country_id, 'State', 'WA', 'Washington' )
    ,( the_country_id, 'State', 'WV', 'West Virginia' )
    ,( the_country_id, 'State', 'WI', 'Wisconsin' )
    ,( the_country_id, 'State', 'WY', 'Wyoming' )
    ,( the_country_id, 'Outlying area', 'AS', 'American Samoa' )
    ,( the_country_id, 'District', 'DC', 'District of Columbia' )
    ,( the_country_id, 'Outlying area', 'GU', 'Guam' )
    ,( the_country_id, 'Outlying area', 'MP', 'Northern Mariana Islands' )
    ,( the_country_id, 'Outlying area', 'PR', 'Puerto Rico' )
    ,( the_country_id, 'Outlying area', 'UM', 'U.S. Minor Outlying Islands' )
    ,( the_country_id, 'Outlying area', 'VI', 'Virgin Islands of the U.S.' )
    ,( the_country_id, 'Military Address', 'AE', 'Armed Forces Africa, Canada, Europe, Middle East' )
    ,( the_country_id, 'Military Address', 'AA', 'Armed Forces Americas (except Canada)' )
    ,( the_country_id, 'Military Address', 'AP', 'Armed Forces Pacific' );
    
    -- Andorra
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'AD' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Parish', '02', 'Canillo' )
    ,( the_country_id, 'Parish', '03', 'Encamp' )
    ,( the_country_id, 'Parish', '04', 'La Massana' )
    ,( the_country_id, 'Parish', '05', 'Ordino' )
    ,( the_country_id, 'Parish', '06', 'Sant Julià de Lòria' )
    ,( the_country_id, 'Parish', '07', 'Andorra la Vella' )
    ,( the_country_id, 'Parish', '08', 'Escaldes-Engordany' );
    
    -- United Arab Emirates
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'AE' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Emirate', 'AJ', 'Ajman' )
    ,( the_country_id, 'Emirate', 'AZ', 'Abu Z¸aby [Abu Dhabi]' )
    ,( the_country_id, 'Emirate', 'DU', 'Dubayy [Dubai]' )
    ,( the_country_id, 'Emirate', 'FU', 'Al Fujayrah' )
    ,( the_country_id, 'Emirate', 'RK', 'Ra’s al Khaymah' )
    ,( the_country_id, 'Emirate', 'SH', 'Ash Shariqah [Sharjah]' )
    ,( the_country_id, 'Emirate', 'UQ', 'Umm al Qaywayn' );
    
    -- Afghanistan
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'AF' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'BAL', 'Balkh' )
    ,( the_country_id, 'Province', 'BAM', 'Bamyan' )
    ,( the_country_id, 'Province', 'BDG', 'Badghis' )
    ,( the_country_id, 'Province', 'BDS', 'Badakhshan' )
    ,( the_country_id, 'Province', 'BGL', 'Baghlan' )
    ,( the_country_id, 'Province', 'DAY', 'Daykundi' )
    ,( the_country_id, 'Province', 'FRA', 'Farah' )
    ,( the_country_id, 'Province', 'FYB', 'Faryab' )
    ,( the_country_id, 'Province', 'GHA', 'Ghazni' )
    ,( the_country_id, 'Province', 'GHO', 'Ghor' )
    ,( the_country_id, 'Province', 'HEL', 'Helmand' )
    ,( the_country_id, 'Province', 'HER', 'Herat' )
    ,( the_country_id, 'Province', 'JOW', 'Jowzjan' )
    ,( the_country_id, 'Province', 'KAB', 'Kabul' )
    ,( the_country_id, 'Province', 'KAN', 'Kandahar' )
    ,( the_country_id, 'Province', 'KAP', 'Kapisa' )
    ,( the_country_id, 'Province', 'KDZ', 'Kunduz' )
    ,( the_country_id, 'Province', 'KHO', 'Khost' )
    ,( the_country_id, 'Province', 'KNR', 'Kunar' )
    ,( the_country_id, 'Province', 'LAG', 'Laghman' )
    ,( the_country_id, 'Province', 'LOG', 'Logar' )
    ,( the_country_id, 'Province', 'NAN', 'Nangarhar' )
    ,( the_country_id, 'Province', 'NIM', 'Nimroz' )
    ,( the_country_id, 'Province', 'NUR', 'Nuristan' )
    ,( the_country_id, 'Province', 'PAN', 'Panjshayr' )
    ,( the_country_id, 'Province', 'PAR', 'Parwan' )
    ,( the_country_id, 'Province', 'PIA', 'Paktiya' )
    ,( the_country_id, 'Province', 'PKA', 'Paktika' )
    ,( the_country_id, 'Province', 'SAM', 'Samangan' )
    ,( the_country_id, 'Province', 'SAR', 'Sar-e Pul' )
    ,( the_country_id, 'Province', 'TAK', 'Takhar' )
    ,( the_country_id, 'Province', 'URU', 'Uruzgan' )
    ,( the_country_id, 'Province', 'WAR', 'Wardak' )
    ,( the_country_id, 'Province', 'ZAB', 'Zabul' );
    
    -- Antigua and Barbuda
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'AG' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Parish', '03', 'Saint George' )
    ,( the_country_id, 'Parish', '04', 'Saint John' )
    ,( the_country_id, 'Parish', '05', 'Saint Mary' )
    ,( the_country_id, 'Parish', '06', 'Saint Paul' )
    ,( the_country_id, 'Parish', '07', 'Saint Peter' )
    ,( the_country_id, 'Parish', '08', 'Saint Philip' )
    ,( the_country_id, 'Dependency', '10', 'Barbuda' )
    ,( the_country_id, 'Dependency', '11', 'Redonda' );
    
    -- Albania
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'AL' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', 'BR', 'Berat' )
    ,( the_country_id, 'District', 'BU', 'Bulqizë' )
    ,( the_country_id, 'District', 'DI', 'Dibër' )
    ,( the_country_id, 'District', 'DL', 'Delvinë' )
    ,( the_country_id, 'District', 'DR', 'Durrës' )
    ,( the_country_id, 'District', 'DV', 'Devoll' )
    ,( the_country_id, 'District', 'EL', 'Elbasan' )
    ,( the_country_id, 'District', 'ER', 'Kolonjë' )
    ,( the_country_id, 'District', 'FR', 'Fier' )
    ,( the_country_id, 'District', 'GJ', 'Gjirokastër' )
    ,( the_country_id, 'District', 'GR', 'Gramsh' )
    ,( the_country_id, 'District', 'HA', 'Has' )
    ,( the_country_id, 'District', 'KA', 'Kavajë' )
    ,( the_country_id, 'District', 'KB', 'Kurbin' )
    ,( the_country_id, 'District', 'KC', 'Kuçovë' )
    ,( the_country_id, 'District', 'KO', 'Korçë' )
    ,( the_country_id, 'District', 'KR', 'Krujë' )
    ,( the_country_id, 'District', 'KU', 'Kukës' )
    ,( the_country_id, 'District', 'LB', 'Librazhd' )
    ,( the_country_id, 'District', 'LE', 'Lezhë' )
    ,( the_country_id, 'District', 'LU', 'Lushnjë' )
    ,( the_country_id, 'District', 'MK', 'Mallakastër' )
    ,( the_country_id, 'District', 'MM', 'Malësi e Madhe' )
    ,( the_country_id, 'District', 'MR', 'Mirditë' )
    ,( the_country_id, 'District', 'MT', 'Mat' )
    ,( the_country_id, 'District', 'PG', 'Pogradec' )
    ,( the_country_id, 'District', 'PQ', 'Peqin' )
    ,( the_country_id, 'District', 'PR', 'Përmet' )
    ,( the_country_id, 'District', 'PU', 'Pukë' )
    ,( the_country_id, 'District', 'SH', 'Shkodër' )
    ,( the_country_id, 'District', 'SK', 'Skrapar' )
    ,( the_country_id, 'District', 'SR', 'Sarandë' )
    ,( the_country_id, 'District', 'TE', 'Tepelenë' )
    ,( the_country_id, 'District', 'TP', 'Tropojë' )
    ,( the_country_id, 'District', 'TR', 'Tiranë' )
    ,( the_country_id, 'District', 'VL', 'Vlorë' );
    
    -- Armenia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'AM' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'AG', 'Aragac̣otn' )
    ,( the_country_id, 'Region', 'AR', 'Ararat' )
    ,( the_country_id, 'Region', 'AV', 'Armavir' )
    ,( the_country_id, 'City', 'ER', 'Erevan' )
    ,( the_country_id, 'Region', 'GR', 'Geġark''unik''' )
    ,( the_country_id, 'Region', 'KT', 'Kotayk''' )
    ,( the_country_id, 'Region', 'LO', 'Loṙi' )
    ,( the_country_id, 'Region', 'SH', 'Širak' )
    ,( the_country_id, 'Region', 'SU', 'Syunik''' )
    ,( the_country_id, 'Region', 'TV', 'Tavuš' )
    ,( the_country_id, 'Region', 'VD', 'Vayoc Jor' );
    
    -- Angola
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'AO' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'BGO', 'Bengo' )
    ,( the_country_id, 'Province', 'BGU', 'Benguela' )
    ,( the_country_id, 'Province', 'BIE', 'Bié' )
    ,( the_country_id, 'Province', 'CAB', 'Cabinda' )
    ,( the_country_id, 'Province', 'CCU', 'Kuando Kubango' )
    ,( the_country_id, 'Province', 'CNN', 'Cunene' )
    ,( the_country_id, 'Province', 'CNO', 'Kwanza Norte' )
    ,( the_country_id, 'Province', 'CUS', 'Kwanza Sul' )
    ,( the_country_id, 'Province', 'HUA', 'Huambo' )
    ,( the_country_id, 'Province', 'HUI', 'Huíla' )
    ,( the_country_id, 'Province', 'LNO', 'Lunda Norte' )
    ,( the_country_id, 'Province', 'LSU', 'Lunda Sul' )
    ,( the_country_id, 'Province', 'LUA', 'Luanda' )
    ,( the_country_id, 'Province', 'MAL', 'Malange' )
    ,( the_country_id, 'Province', 'MOX', 'Moxico' )
    ,( the_country_id, 'Province', 'NAM', 'Namibe' )
    ,( the_country_id, 'Province', 'UIG', 'Uíge' )
    ,( the_country_id, 'Province', 'ZAI', 'Zaire' );
    
    -- Argentina
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'AR' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'A', 'Salta' )
    ,( the_country_id, 'Province', 'B', 'Buenos Aires' )
    ,( the_country_id, 'City', 'C', 'Ciudad Autónoma de Buenos Aires' )
    ,( the_country_id, 'Province', 'D', 'San Luis' )
    ,( the_country_id, 'Province', 'E', 'Entre Ríos' )
    ,( the_country_id, 'Province', 'F', 'La Rioja' )
    ,( the_country_id, 'Province', 'G', 'Santiago del Estero' )
    ,( the_country_id, 'Province', 'H', 'Chaco' )
    ,( the_country_id, 'Province', 'J', 'San Juan' )
    ,( the_country_id, 'Province', 'K', 'Catamarca' )
    ,( the_country_id, 'Province', 'L', 'La Pampa' )
    ,( the_country_id, 'Province', 'M', 'Mendoza' )
    ,( the_country_id, 'Province', 'N', 'Misiones' )
    ,( the_country_id, 'Province', 'P', 'Formosa' )
    ,( the_country_id, 'Province', 'Q', 'Neuquén' )
    ,( the_country_id, 'Province', 'R', 'Río Negro' )
    ,( the_country_id, 'Province', 'S', 'Santa Fe' )
    ,( the_country_id, 'Province', 'T', 'Tucumán' )
    ,( the_country_id, 'Province', 'U', 'Chubut' )
    ,( the_country_id, 'Province', 'V', 'Tierra del Fuego' )
    ,( the_country_id, 'Province', 'W', 'Corrientes' )
    ,( the_country_id, 'Province', 'X', 'Córdoba' )
    ,( the_country_id, 'Province', 'Y', 'Jujuy' )
    ,( the_country_id, 'Province', 'Z', 'Santa Cruz' );
    
    -- Austria
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'AT' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'federal Länder', '1', 'Burgenland' )
    ,( the_country_id, 'federal Länder', '2', 'Kärnten' )
    ,( the_country_id, 'federal Länder', '3', 'Niederösterreich' )
    ,( the_country_id, 'federal Länder', '4', 'Oberösterreich' )
    ,( the_country_id, 'federal Länder', '5', 'Salzburg' )
    ,( the_country_id, 'federal Länder', '6', 'Steiermark' )
    ,( the_country_id, 'federal Länder', '7', 'Tirol' )
    ,( the_country_id, 'federal Länder', '8', 'Vorarlberg' )
    ,( the_country_id, 'federal Länder', '9', 'Wien' );
    
    -- Australia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'AU' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Territory', 'ACT', 'Australian Capital Territory' )
    ,( the_country_id, 'State', 'NSW', 'New South Wales' )
    ,( the_country_id, 'Territory', 'NT', 'Northern Territory' )
    ,( the_country_id, 'State', 'QLD', 'Queensland' )
    ,( the_country_id, 'State', 'SA', 'South Australia' )
    ,( the_country_id, 'State', 'TAS', 'Tasmania' )
    ,( the_country_id, 'State', 'VIC', 'Victoria' )
    ,( the_country_id, 'State', 'WA', 'Western Australia' );
    
    -- Azerbaijan
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'AZ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Rayon', 'ABS', 'Abseron' )
    ,( the_country_id, 'Rayon', 'AGA', 'Agstafa' )
    ,( the_country_id, 'Rayon', 'AGC', 'Ağcabədi' )
    ,( the_country_id, 'Rayon', 'AGM', 'Agdam' )
    ,( the_country_id, 'Rayon', 'AGS', 'Agdas' )
    ,( the_country_id, 'Rayon', 'AGU', 'Agsu' )
    ,( the_country_id, 'Rayon', 'AST', 'Astara' )
    ,( the_country_id, 'Municipality', 'BA', 'Baki' )
    ,( the_country_id, 'Rayon', 'BAB', 'Babək' )
    ,( the_country_id, 'Rayon', 'BAL', 'Balakən' )
    ,( the_country_id, 'Rayon', 'BAR', 'Bərdə' )
    ,( the_country_id, 'Rayon', 'BEY', 'Beyləqan' )
    ,( the_country_id, 'Rayon', 'BIL', 'Biləsuvar' )
    ,( the_country_id, 'Rayon', 'CAB', 'Cəbrayıl' )
    ,( the_country_id, 'Rayon', 'CAL', 'Cəlilabad' )
    ,( the_country_id, 'Rayon', 'CUL', 'Culfa' )
    ,( the_country_id, 'Rayon', 'DAS', 'Daşkəsən' )
    ,( the_country_id, 'Rayon', 'FUZ', 'Füzuli' )
    ,( the_country_id, 'Municipality', 'GA', 'Gəncə' )
    ,( the_country_id, 'Rayon', 'GAD', 'Gədəbəy' )
    ,( the_country_id, 'Rayon', 'GOR', 'Goranboy' )
    ,( the_country_id, 'Rayon', 'GOY', 'Göyçay' )
    ,( the_country_id, 'Rayon', 'GYG', 'Göygöl' )
    ,( the_country_id, 'Rayon', 'HAC', 'Haciqabul' )
    ,( the_country_id, 'Rayon', 'IMI', 'Imisli' )
    ,( the_country_id, 'Rayon', 'ISM', 'Ismayilli' )
    ,( the_country_id, 'Rayon', 'KAL', 'Kəlbəcər' )
    ,( the_country_id, 'Rayon', 'KAN', 'Kǝngǝrli' )
    ,( the_country_id, 'Rayon', 'KUR', 'Kürdəmir' )
    ,( the_country_id, 'Municipality', 'LA', 'Lənkəran (Municipality)' )
    ,( the_country_id, 'Rayon', 'LAC', 'Laçin' )
    ,( the_country_id, 'Rayon', 'LAN', 'Lənkəran (Rayon)' )
    ,( the_country_id, 'Rayon', 'LER', 'Lerik' )
    ,( the_country_id, 'Rayon', 'MAS', 'Masalli' )
    ,( the_country_id, 'Municipality', 'MI', 'Mingəçevir' )
    ,( the_country_id, 'Municipality', 'NA', 'Naftalan' )
    ,( the_country_id, 'Rayon', 'NEF', 'Neftçala' )
    ,( the_country_id, 'Municipality', 'NV', 'Naxçivan' )
    ,( the_country_id, 'Autonomous republic', 'NX', 'Naxçivan' )
    ,( the_country_id, 'Rayon', 'OGU', 'Oguz' )
    ,( the_country_id, 'Rayon', 'ORD', 'Ordubad' )
    ,( the_country_id, 'Rayon', 'QAB', 'Qəbələ' )
    ,( the_country_id, 'Rayon', 'QAX', 'Qax' )
    ,( the_country_id, 'Rayon', 'QAZ', 'Qazax' )
    ,( the_country_id, 'Rayon', 'QBA', 'Quba' )
    ,( the_country_id, 'Rayon', 'QBI', 'Qubadli' )
    ,( the_country_id, 'Rayon', 'QOB', 'Qobustan' )
    ,( the_country_id, 'Rayon', 'QUS', 'Qusar' )
    ,( the_country_id, 'Municipality', 'SA', 'Şəki' )
    ,( the_country_id, 'Rayon', 'SAB', 'Sabirabad' )
    ,( the_country_id, 'Rayon', 'SAD', 'Sədərək' )
    ,( the_country_id, 'Rayon', 'SAH', 'Sahbuz' )
    ,( the_country_id, 'Rayon', 'SAK', 'Şəki' )
    ,( the_country_id, 'Rayon', 'SAL', 'Salyan' )
    ,( the_country_id, 'Rayon', 'SAR', 'Şərur' )
    ,( the_country_id, 'Rayon', 'SAT', 'Saatli' )
    ,( the_country_id, 'Rayon', 'SBN', 'Sabran' )
    ,( the_country_id, 'Rayon', 'SIY', 'Siyəzən' )
    ,( the_country_id, 'Rayon', 'SKR', 'Şəmkir' )
    ,( the_country_id, 'Municipality', 'SM', 'Sumqayit' )
    ,( the_country_id, 'Rayon', 'SMI', 'Samaxi' )
    ,( the_country_id, 'Rayon', 'SMX', 'Samux' )
    ,( the_country_id, 'Municipality', 'SR', 'Sirvan' )
    ,( the_country_id, 'Rayon', 'SUS', 'Susa' )
    ,( the_country_id, 'Rayon', 'TAR', 'Tərtər' )
    ,( the_country_id, 'Rayon', 'TOV', 'Tovuz' )
    ,( the_country_id, 'Rayon', 'UCA', 'Ucar' )
    ,( the_country_id, 'Municipality', 'XA', 'Xankəndi' )
    ,( the_country_id, 'Rayon', 'XAC', 'Xaçmaz' )
    ,( the_country_id, 'Rayon', 'XCI', 'Xocali' )
    ,( the_country_id, 'Rayon', 'XIZ', 'Xizi' )
    ,( the_country_id, 'Rayon', 'XVD', 'Xocavənd' )
    ,( the_country_id, 'Rayon', 'YAR', 'Yardimli' )
    ,( the_country_id, 'Municipality', 'YE', 'Yevlax' )
    ,( the_country_id, 'Rayon', 'YEV', 'Yevlax' )
    ,( the_country_id, 'Rayon', 'ZAN', 'Zəngilan' )
    ,( the_country_id, 'Rayon', 'ZAQ', 'Zaqatala' )
    ,( the_country_id, 'Rayon', 'ZAR', 'Zərdab' );
    
    -- Bosnia and Herzegovina
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BA' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Canton', '01', 'Unsko-Sanski Kanton' )
    ,( the_country_id, 'Canton', '02', 'Posavski Kanton' )
    ,( the_country_id, 'Canton', '03', 'Tuzlanski Kanton' )
    ,( the_country_id, 'Canton', '04', 'Zenicko-Dobojski Kanton' )
    ,( the_country_id, 'Canton', '05', 'Bosansko-Podrinjski Kanton' )
    ,( the_country_id, 'Canton', '06', 'Srednjobosanski Kanton' )
    ,( the_country_id, 'Canton', '07', 'Hercegovacko-Neretvanski Kanton' )
    ,( the_country_id, 'Canton', '08', 'Zapadnohercegovacki kanton' )
    ,( the_country_id, 'Canton', '09', 'Kanton Sarajevo' )
    ,( the_country_id, 'Canton', '10', 'Županija br. 10 (Hercegbosanska županija)' )
    ,( the_country_id, 'Entity', 'BIH', 'Federacija Bosne i Hercegovine' )
    ,( the_country_id, 'District with special status', 'BRC', 'Brcko distrikt' )
    ,( the_country_id, 'Entity', 'SRP', 'Republika Srpska' );
    
    -- Barbados
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BB' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Parish', '01', 'Christ Church' )
    ,( the_country_id, 'Parish', '02', 'Saint Andrew' )
    ,( the_country_id, 'Parish', '03', 'Saint George' )
    ,( the_country_id, 'Parish', '04', 'Saint James' )
    ,( the_country_id, 'Parish', '05', 'Saint John' )
    ,( the_country_id, 'Parish', '06', 'Saint Joseph' )
    ,( the_country_id, 'Parish', '07', 'Saint Lucy' )
    ,( the_country_id, 'Parish', '08', 'Saint Michael' )
    ,( the_country_id, 'Parish', '09', 'Saint Peter' )
    ,( the_country_id, 'Parish', '10', 'Saint Philip' )
    ,( the_country_id, 'Parish', '11', 'Saint Thomas' );
    
    -- Bangladesh
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BD' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', '01', 'Bandarban' )
    ,( the_country_id, 'District', '02', 'Barguna' )
    ,( the_country_id, 'District', '03', 'Bogra' )
    ,( the_country_id, 'District', '04', 'Brahmanbaria' )
    ,( the_country_id, 'District', '05', 'Bagerhat' )
    ,( the_country_id, 'District', '06', 'Barisal' )
    ,( the_country_id, 'District', '07', 'Bhola' )
    ,( the_country_id, 'District', '08', 'Comilla' )
    ,( the_country_id, 'District', '09', 'Chandpur' )
    ,( the_country_id, 'District', '10', 'Chittagong' )
    ,( the_country_id, 'District', '11', 'Cox''s Bazar' )
    ,( the_country_id, 'District', '12', 'Chuadanga' )
    ,( the_country_id, 'District', '13', 'Dhaka' )
    ,( the_country_id, 'District', '14', 'Dinajpur' )
    ,( the_country_id, 'District', '15', 'Faridpur' )
    ,( the_country_id, 'District', '16', 'Feni' )
    ,( the_country_id, 'District', '17', 'Gopalganj' )
    ,( the_country_id, 'District', '18', 'Gazipur' )
    ,( the_country_id, 'District', '19', 'Gaibandha' )
    ,( the_country_id, 'District', '20', 'Habiganj' )
    ,( the_country_id, 'District', '21', 'Jamalpur' )
    ,( the_country_id, 'District', '22', 'Jessore' )
    ,( the_country_id, 'District', '23', 'Jhenaidah' )
    ,( the_country_id, 'District', '24', 'Jaipurhat' )
    ,( the_country_id, 'District', '25', 'Jhalakati' )
    ,( the_country_id, 'District', '26', 'Kishoreganj' )
    ,( the_country_id, 'District', '27', 'Khulna' )
    ,( the_country_id, 'District', '28', 'Kurigram' )
    ,( the_country_id, 'District', '29', 'Khagrachari' )
    ,( the_country_id, 'District', '30', 'Kushtia' )
    ,( the_country_id, 'District', '31', 'Lakshmipur' )
    ,( the_country_id, 'District', '32', 'Lalmonirhat' )
    ,( the_country_id, 'District', '33', 'Manikganj' )
    ,( the_country_id, 'District', '34', 'Mymensingh' )
    ,( the_country_id, 'District', '35', 'Munshiganj' )
    ,( the_country_id, 'District', '36', 'Madaripur' )
    ,( the_country_id, 'District', '37', 'Magura' )
    ,( the_country_id, 'District', '38', 'Moulvibazar' )
    ,( the_country_id, 'District', '39', 'Meherpur' )
    ,( the_country_id, 'District', '40', 'Narayanganj' )
    ,( the_country_id, 'District', '41', 'Netrakona' )
    ,( the_country_id, 'District', '42', 'Narsingdi' )
    ,( the_country_id, 'District', '43', 'Narail' )
    ,( the_country_id, 'District', '44', 'Natore' )
    ,( the_country_id, 'District', '45', 'Nawabganj' )
    ,( the_country_id, 'District', '46', 'Nilphamari' )
    ,( the_country_id, 'District', '47', 'Noakhali' )
    ,( the_country_id, 'District', '48', 'Naogaon' )
    ,( the_country_id, 'District', '49', 'Pabna' )
    ,( the_country_id, 'District', '50', 'Pirojpur' )
    ,( the_country_id, 'District', '51', 'Patuakhali' )
    ,( the_country_id, 'District', '52', 'Panchagarh' )
    ,( the_country_id, 'District', '53', 'Rajbari' )
    ,( the_country_id, 'District', '54', 'Rajshahi' )
    ,( the_country_id, 'District', '55', 'Rangpur' )
    ,( the_country_id, 'District', '56', 'Rangamati' )
    ,( the_country_id, 'District', '57', 'Sherpur' )
    ,( the_country_id, 'District', '58', 'Satkhira' )
    ,( the_country_id, 'District', '59', 'Sirajganj' )
    ,( the_country_id, 'District', '60', 'Sylhet' )
    ,( the_country_id, 'District', '61', 'Sunamganj' )
    ,( the_country_id, 'District', '62', 'Shariatpur' )
    ,( the_country_id, 'District', '63', 'Tangail' )
    ,( the_country_id, 'District', '64', 'Thakurgaon' );
    
    -- Belgium
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BE' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'BRU', 'Bruxelles-Capitale, Région de' )
    ,( the_country_id, 'Province', 'VAN', 'Antwerpen' )
    ,( the_country_id, 'Province', 'VBR', 'Vlaams Brabant' )
    ,( the_country_id, 'Region', 'VLG', 'Vlaamse Gewest' )
    ,( the_country_id, 'Province', 'VLI', 'Limburg' )
    ,( the_country_id, 'Province', 'VOV', 'Oost-Vlaanderen' )
    ,( the_country_id, 'Province', 'VWV', 'West-Vlaanderen' )
    ,( the_country_id, 'Region', 'WAL', 'Wallonne, Région' )
    ,( the_country_id, 'Province', 'WBR', 'Brabant wallon' )
    ,( the_country_id, 'Province', 'WHT', 'Hainaut' )
    ,( the_country_id, 'Province', 'WLG', 'Liège' )
    ,( the_country_id, 'Province', 'WLX', 'Luxembourg' )
    ,( the_country_id, 'Province', 'WNA', 'Namur' );
    
    -- Burkina Faso
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BF' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'BAL', 'Balé' )
    ,( the_country_id, 'Province', 'BAM', 'Bam' )
    ,( the_country_id, 'Province', 'BAN', 'Banwa' )
    ,( the_country_id, 'Province', 'BAZ', 'Bazèga ga' )
    ,( the_country_id, 'Province', 'BGR', 'Bougouriba' )
    ,( the_country_id, 'Province', 'BLG', 'Boulgou' )
    ,( the_country_id, 'Province', 'BLK', 'Boulkiemdé' )
    ,( the_country_id, 'Province', 'COM', 'Comoé' )
    ,( the_country_id, 'Province', 'GAN', 'Ganzourgou' )
    ,( the_country_id, 'Province', 'GNA', 'Gnagna' )
    ,( the_country_id, 'Province', 'GOU', 'Gourma' )
    ,( the_country_id, 'Province', 'HOU', 'Houet' )
    ,( the_country_id, 'Province', 'IOB', 'Ioba' )
    ,( the_country_id, 'Province', 'KAD', 'Kadiogo' )
    ,( the_country_id, 'Province', 'KEN', 'Kénédougou' )
    ,( the_country_id, 'Province', 'KMD', 'Komondjari' )
    ,( the_country_id, 'Province', 'KMP', 'Kompienga' )
    ,( the_country_id, 'Province', 'KOP', 'Koulpélogo' )
    ,( the_country_id, 'Province', 'KOS', 'Kossi' )
    ,( the_country_id, 'Province', 'KOT', 'Kouritenga' )
    ,( the_country_id, 'Province', 'KOW', 'Kourwéogo' )
    ,( the_country_id, 'Province', 'LER', 'Léraba' )
    ,( the_country_id, 'Province', 'LOR', 'Loroum' )
    ,( the_country_id, 'Province', 'MOU', 'Mouhoun' )
    ,( the_country_id, 'Province', 'NAM', 'Namentenga' )
    ,( the_country_id, 'Province', 'NAO', 'Nahouri' )
    ,( the_country_id, 'Province', 'NAY', 'Nayala' )
    ,( the_country_id, 'Province', 'NOU', 'Noumbiel' )
    ,( the_country_id, 'Province', 'OUB', 'Oubritenga' )
    ,( the_country_id, 'Province', 'OUD', 'Oudalan' )
    ,( the_country_id, 'Province', 'PAS', 'Passoré' )
    ,( the_country_id, 'Province', 'PON', 'Poni' )
    ,( the_country_id, 'Province', 'SEN', 'Séno' )
    ,( the_country_id, 'Province', 'SIS', 'Sissili' )
    ,( the_country_id, 'Province', 'SMT', 'Sanmatenga' )
    ,( the_country_id, 'Province', 'SNG', 'Sanguié' )
    ,( the_country_id, 'Province', 'SOM', 'Soum' )
    ,( the_country_id, 'Province', 'SOR', 'Sourou' )
    ,( the_country_id, 'Province', 'TAP', 'Tapoa' )
    ,( the_country_id, 'Province', 'TUI', 'Tui' )
    ,( the_country_id, 'Province', 'YAG', 'Yagha' )
    ,( the_country_id, 'Province', 'YAT', 'Yatenga' )
    ,( the_country_id, 'Province', 'ZIR', 'Ziro' )
    ,( the_country_id, 'Province', 'ZON', 'Zondoma' )
    ,( the_country_id, 'Province', 'ZOU', 'Zoundwéogo' );
    
    -- Bulgaria
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BG' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', '01', 'Blagoevgrad' )
    ,( the_country_id, 'Region', '02', 'Burgas' )
    ,( the_country_id, 'Region', '03', 'Varna' )
    ,( the_country_id, 'Region', '04', 'Veliko Tarnovo' )
    ,( the_country_id, 'Region', '05', 'Vidin' )
    ,( the_country_id, 'Region', '06', 'Vratsa' )
    ,( the_country_id, 'Region', '07', 'Gabrovo' )
    ,( the_country_id, 'Region', '08', 'Dobrich' )
    ,( the_country_id, 'Region', '09', 'Kardzhali' )
    ,( the_country_id, 'Region', '10', 'Kjustendil' )
    ,( the_country_id, 'Region', '11', 'Lovech' )
    ,( the_country_id, 'Region', '12', 'Montana' )
    ,( the_country_id, 'Region', '13', 'Pazardzik' )
    ,( the_country_id, 'Region', '14', 'Pernik' )
    ,( the_country_id, 'Region', '15', 'Pleven' )
    ,( the_country_id, 'Region', '16', 'Plovdiv' )
    ,( the_country_id, 'Region', '17', 'Razgrad' )
    ,( the_country_id, 'Region', '18', 'Ruse' )
    ,( the_country_id, 'Region', '19', 'Silistra' )
    ,( the_country_id, 'Region', '20', 'Sliven' )
    ,( the_country_id, 'Region', '21', 'Smolyan' )
    ,( the_country_id, 'Region', '22', 'Sofia (stolitsa)' )
    ,( the_country_id, 'Region', '23', 'Sofia' )
    ,( the_country_id, 'Region', '24', 'Stara Zagora' )
    ,( the_country_id, 'Region', '25', 'Targovishte' )
    ,( the_country_id, 'Region', '26', 'Haskovo' )
    ,( the_country_id, 'Region', '27', 'Shumen' )
    ,( the_country_id, 'Region', '28', 'Yambol' );
    
    -- Bahrain
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BH' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Governorat', '13', 'Al Manamah (Al ‘Asimah)' )
    ,( the_country_id, 'Governorat', '14', 'Al Janubiyah' )
    ,( the_country_id, 'Governorat', '15', 'Al Muḩarraq' )
    ,( the_country_id, 'Governorat', '16', 'Al Wustá' )
    ,( the_country_id, 'Governorat', '17', 'Ash Shamaliyah' );
    
    -- Burundi
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BI' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'BB', 'Bubanza' )
    ,( the_country_id, 'Province', 'BL', 'Bujumbura Rural' )
    ,( the_country_id, 'Province', 'BM', 'Bujumbura Mairie' )
    ,( the_country_id, 'Province', 'BR', 'Bururi' )
    ,( the_country_id, 'Province', 'CA', 'Cankuzo' )
    ,( the_country_id, 'Province', 'CI', 'Cibitoke' )
    ,( the_country_id, 'Province', 'GI', 'Gitega' )
    ,( the_country_id, 'Province', 'KI', 'Kirundo' )
    ,( the_country_id, 'Province', 'KR', 'Karuzi' )
    ,( the_country_id, 'Province', 'KY', 'Kayanza' )
    ,( the_country_id, 'Province', 'MA', 'Makamba' )
    ,( the_country_id, 'Province', 'MU', 'Muramvya' )
    ,( the_country_id, 'Province', 'MW', 'Mwaro' )
    ,( the_country_id, 'Province', 'MY', 'Muyinga' )
    ,( the_country_id, 'Province', 'NG', 'Ngozi' )
    ,( the_country_id, 'Province', 'RT', 'Rutana' )
    ,( the_country_id, 'Province', 'RY', 'Ruyigi' );
    
    -- Benin
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BJ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Department', 'AK', 'Atakora' )
    ,( the_country_id, 'Department', 'AL', 'Alibori' )
    ,( the_country_id, 'Department', 'AQ', 'Atlantique' )
    ,( the_country_id, 'Department', 'BO', 'Borgou' )
    ,( the_country_id, 'Department', 'CO', 'Collines' )
    ,( the_country_id, 'Department', 'DO', 'Donga' )
    ,( the_country_id, 'Department', 'KO', 'Kouffo' )
    ,( the_country_id, 'Department', 'LI', 'Littoral' )
    ,( the_country_id, 'Department', 'MO', 'Mono' )
    ,( the_country_id, 'Department', 'OU', 'Ouémé' )
    ,( the_country_id, 'Department', 'PL', 'Plateau' )
    ,( the_country_id, 'Department', 'ZO', 'Zou' );
    
    -- Brunei Darussalam
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BN' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', 'BE', 'Belait' )
    ,( the_country_id, 'District', 'BM', 'Brunei-Muara' )
    ,( the_country_id, 'District', 'TE', 'Temburong' )
    ,( the_country_id, 'District', 'TU', 'Tutong' );
    
    -- Bolivia (Plurinational State of)
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BO' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Department', 'B', 'El Beni' )
    ,( the_country_id, 'Department', 'C', 'Cochabamba' )
    ,( the_country_id, 'Department', 'H', 'Chuquisaca' )
    ,( the_country_id, 'Department', 'L', 'La Paz' )
    ,( the_country_id, 'Department', 'N', 'Pando' )
    ,( the_country_id, 'Department', 'O', 'Oruro' )
    ,( the_country_id, 'Department', 'P', 'Potosí' )
    ,( the_country_id, 'Department', 'S', 'Santa Cruz' )
    ,( the_country_id, 'Department', 'T', 'Tarija' );
    
    -- Bonaire, Sint Eustatius and Saba
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BQ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Special Municipality', 'BO', 'Bonaire' )
    ,( the_country_id, 'Special Municipality', 'SA', 'Saba' )
    ,( the_country_id, 'Special Municipality', 'SE', 'Sint Eustatius' );
    
    -- Brazil
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BR' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'State', 'AC', 'Acre' )
    ,( the_country_id, 'State', 'AL', 'Alagoas' )
    ,( the_country_id, 'State', 'AM', 'Amazonas' )
    ,( the_country_id, 'State', 'AP', 'Amapá' )
    ,( the_country_id, 'State', 'BA', 'Bahia' )
    ,( the_country_id, 'State', 'CE', 'Ceará' )
    ,( the_country_id, 'Federal district', 'DF', 'Distrito Federal' )
    ,( the_country_id, 'State', 'ES', 'Espírito Santo' )
    ,( the_country_id, 'State', 'GO', 'Goiás' )
    ,( the_country_id, 'State', 'MA', 'Maranhão' )
    ,( the_country_id, 'State', 'MG', 'Minas Gerais' )
    ,( the_country_id, 'State', 'MS', 'Mato Grosso do Sul' )
    ,( the_country_id, 'State', 'MT', 'Mato Grosso' )
    ,( the_country_id, 'State', 'PA', 'Pará' )
    ,( the_country_id, 'State', 'PB', 'Paraíba' )
    ,( the_country_id, 'State', 'PE', 'Pernambuco' )
    ,( the_country_id, 'State', 'PI', 'Piauí' )
    ,( the_country_id, 'State', 'PR', 'Paraná' )
    ,( the_country_id, 'State', 'RJ', 'Rio de Janeiro' )
    ,( the_country_id, 'State', 'RN', 'Rio Grande do Norte' )
    ,( the_country_id, 'State', 'RO', 'Rondônia' )
    ,( the_country_id, 'State', 'RR', 'Roraima' )
    ,( the_country_id, 'State', 'RS', 'Rio Grande do Sul' )
    ,( the_country_id, 'State', 'SC', 'Santa Catarina' )
    ,( the_country_id, 'State', 'SE', 'Sergipe' )
    ,( the_country_id, 'State', 'SP', 'São Paulo' )
    ,( the_country_id, 'State', 'TO', 'Tocantins' );
    
    -- Bahamas
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BS' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', 'AK', 'Acklins' )
    ,( the_country_id, 'District', 'BI', 'Bimini' )
    ,( the_country_id, 'District', 'BP', 'Black Point' )
    ,( the_country_id, 'District', 'BY', 'Berry Islands' )
    ,( the_country_id, 'District', 'CE', 'Central Eleuthera' )
    ,( the_country_id, 'District', 'CI', 'Cat Island' )
    ,( the_country_id, 'District', 'CK', 'Crooked Island and Long Cay' )
    ,( the_country_id, 'District', 'CO', 'Central Abaco' )
    ,( the_country_id, 'District', 'CS', 'Central Andros' )
    ,( the_country_id, 'District', 'EG', 'East Grand Bahama' )
    ,( the_country_id, 'District', 'EX', 'Exuma' )
    ,( the_country_id, 'District', 'FP', 'City of Freeport' )
    ,( the_country_id, 'District', 'GC', 'Grand Cay' )
    ,( the_country_id, 'District', 'HI', 'Harbour Island' )
    ,( the_country_id, 'District', 'HT', 'Hope Town' )
    ,( the_country_id, 'District', 'IN', 'Inagua' )
    ,( the_country_id, 'District', 'LI', 'Long Island' )
    ,( the_country_id, 'District', 'MC', 'Mangrove Cay' )
    ,( the_country_id, 'District', 'MG', 'Mayaguana' )
    ,( the_country_id, 'District', 'MI', 'Moore''s Island' )
    ,( the_country_id, 'District', 'NE', 'North Eleuthera' )
    ,( the_country_id, 'District', 'NO', 'North Abaco' )
    ,( the_country_id, 'District', 'NS', 'North Andros' )
    ,( the_country_id, 'District', 'RC', 'Rum Cay' )
    ,( the_country_id, 'District', 'RI', 'Ragged Island' )
    ,( the_country_id, 'District', 'SA', 'South Andros' )
    ,( the_country_id, 'District', 'SE', 'South Eleuthera' )
    ,( the_country_id, 'District', 'SO', 'South Abaco' )
    ,( the_country_id, 'District', 'SS', 'San Salvador' )
    ,( the_country_id, 'District', 'SW', 'Spanish Wells' )
    ,( the_country_id, 'District', 'WG', 'West Grand Bahama' );
    
    -- Bhutan
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BT' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', '11', 'Paro' )
    ,( the_country_id, 'District', '12', 'Chhukha' )
    ,( the_country_id, 'District', '13', 'Ha' )
    ,( the_country_id, 'District', '14', 'Samtse' )
    ,( the_country_id, 'District', '15', 'Thimphu' )
    ,( the_country_id, 'District', '21', 'Tsirang' )
    ,( the_country_id, 'District', '22', 'Dagana' )
    ,( the_country_id, 'District', '23', 'Punakha' )
    ,( the_country_id, 'District', '24', 'Wangdue Phodrang' )
    ,( the_country_id, 'District', '31', 'Sarpang' )
    ,( the_country_id, 'District', '32', 'Trongsa' )
    ,( the_country_id, 'District', '33', 'Bumthang' )
    ,( the_country_id, 'District', '34', 'Zhemgang' )
    ,( the_country_id, 'District', '41', 'Trashigang' )
    ,( the_country_id, 'District', '42', 'Monggar' )
    ,( the_country_id, 'District', '43', 'Pemagatshel' )
    ,( the_country_id, 'District', '44', 'Lhuentse' )
    ,( the_country_id, 'District', '45', 'Samdrup Jongkha' )
    ,( the_country_id, 'District', 'GA', 'Gasa' )
    ,( the_country_id, 'District', 'TY', 'Trashi Yangtse' );
    
    -- Botswana
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BW' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', 'CE', 'Central' )
    ,( the_country_id, 'District', 'CH', 'Chobe' )
    ,( the_country_id, 'City', 'FR', 'Francistown' )
    ,( the_country_id, 'City', 'GA', 'Gaborone' )
    ,( the_country_id, 'District', 'GH', 'Ghanzi' )
    ,( the_country_id, 'Town', 'JW', 'Jwaneng' )
    ,( the_country_id, 'District', 'KG', 'Kgalagadi' )
    ,( the_country_id, 'District', 'KL', 'Kgatleng' )
    ,( the_country_id, 'District', 'KW', 'Kweneng' )
    ,( the_country_id, 'Town', 'LO', 'Lobatse' )
    ,( the_country_id, 'District', 'NE', 'North East' )
    ,( the_country_id, 'District', 'NW', 'North West' )
    ,( the_country_id, 'District', 'SE', 'South East' )
    ,( the_country_id, 'District', 'SO', 'Southern' )
    ,( the_country_id, 'Town', 'SP', 'Selibe Phikwe' )
    ,( the_country_id, 'Town', 'ST', 'Sowa Town' );
    
    -- Belarus
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BY' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Oblast', 'BR', 'Bresckaja voblasc' )
    ,( the_country_id, 'City', 'HM', 'Horad Minsk' )
    ,( the_country_id, 'Oblast', 'HO', 'Homyel''skaya voblasts''' )
    ,( the_country_id, 'Oblast', 'HR', 'Hrodzenskaya voblasts''' )
    ,( the_country_id, 'Oblast', 'MA', 'Mahilyowskaya voblasts''' )
    ,( the_country_id, 'Oblast', 'MI', 'Minskaya voblasts''' )
    ,( the_country_id, 'Oblast', 'VI', 'Vitsyebskaya voblasts''' );
    
    -- Belize
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'BZ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', 'BZ', 'Belize' )
    ,( the_country_id, 'District', 'CY', 'Cayo' )
    ,( the_country_id, 'District', 'CZL', 'Corozal' )
    ,( the_country_id, 'District', 'OW', 'Orange Walk' )
    ,( the_country_id, 'District', 'SC', 'Stann Creek' )
    ,( the_country_id, 'District', 'TOL', 'Toledo' );
    
    -- Canada
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'CA' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'AB', 'Alberta' )
    ,( the_country_id, 'Province', 'BC', 'British Columbia' )
    ,( the_country_id, 'Province', 'MB', 'Manitoba' )
    ,( the_country_id, 'Province', 'NB', 'New Brunswick' )
    ,( the_country_id, 'Province', 'NL', 'Newfoundland and Labrador' )
    ,( the_country_id, 'Province', 'NS', 'Nova Scotia' )
    ,( the_country_id, 'Territory', 'NT', 'Northwest Territories' )
    ,( the_country_id, 'Territory', 'NU', 'Nunavut' )
    ,( the_country_id, 'Province', 'ON', 'Ontario' )
    ,( the_country_id, 'Province', 'PE', 'Prince Edward Island' )
    ,( the_country_id, 'Province', 'QC', 'Quebec' )
    ,( the_country_id, 'Province', 'SK', 'Saskatchewan' )
    ,( the_country_id, 'Territory', 'YT', 'Yukon' );
    
    -- Congo (Democratic Republic of the)
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'CD' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'BC', 'Bas-Congo' )
    ,( the_country_id, 'Province', 'BN', 'Bandundu' )
    ,( the_country_id, 'Province', 'EQ', 'Équateur' )
    ,( the_country_id, 'Province', 'KA', 'Katanga' )
    ,( the_country_id, 'Province', 'KE', 'Kasai-Oriental' )
    ,( the_country_id, 'City', 'KN', 'Kinshasa' )
    ,( the_country_id, 'Province', 'KW', 'Kasai-Occidental' )
    ,( the_country_id, 'Province', 'MA', 'Maniema' )
    ,( the_country_id, 'Province', 'NK', 'Nord-Kivu' )
    ,( the_country_id, 'Province', 'OR', 'Orientale' )
    ,( the_country_id, 'Province', 'SK', 'Sud-Kivu' );
    
    -- Central African Republic
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'CF' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Prefecture', 'AC', 'Ouham' )
    ,( the_country_id, 'Prefecture', 'BB', 'Bamingui-Bangoran' )
    ,( the_country_id, 'Commune', 'BGF', 'Bangui' )
    ,( the_country_id, 'Prefecture', 'BK', 'Basse-Kotto' )
    ,( the_country_id, 'Prefecture', 'HK', 'Haute-Kotto' )
    ,( the_country_id, 'Prefecture', 'HM', 'Haut-Mbomou' )
    ,( the_country_id, 'Prefecture', 'HS', 'Mambéré-Kadéï' )
    ,( the_country_id, 'economic prefecture', 'KB', 'Gribingui' )
    ,( the_country_id, 'Prefecture', 'KG', 'Kémo-Gribingui' )
    ,( the_country_id, 'Prefecture', 'LB', 'Lobaye' )
    ,( the_country_id, 'Prefecture', 'MB', 'Mbomou' )
    ,( the_country_id, 'Prefecture', 'MP', 'Ombella-Mpoko' )
    ,( the_country_id, 'Prefecture', 'NM', 'Nana-Mambéré' )
    ,( the_country_id, 'Prefecture', 'OP', 'Ouham-Pendé' )
    ,( the_country_id, 'economic prefecture', 'SE', 'Sangha' )
    ,( the_country_id, 'Prefecture', 'UK', 'Ouaka' )
    ,( the_country_id, 'Prefecture', 'VK', 'Vakaga' );
    
    -- Congo
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'CG' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Department', '11', 'Bouenza' )
    ,( the_country_id, 'Department', '12', 'Pool' )
    ,( the_country_id, 'Department', '13', 'Sangha' )
    ,( the_country_id, 'Department', '14', 'Plateaux' )
    ,( the_country_id, 'Department', '15', 'Cuvette-Ouest' )
    ,( the_country_id, 'Department', '16', 'Pointe-Noire' )
    ,( the_country_id, 'Department', '2', 'Lékoumou' )
    ,( the_country_id, 'Department', '5', 'Kouilou' )
    ,( the_country_id, 'Department', '7', 'Likouala' )
    ,( the_country_id, 'Department', '8', 'Cuvette' )
    ,( the_country_id, 'Department', '9', 'Niari' )
    ,( the_country_id, 'Department', 'BZV', 'Brazzaville' );
    
    -- Switzerland
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'CH' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Canton', 'AG', 'Aargau' )
    ,( the_country_id, 'Canton', 'AI', 'Appenzell Innerrhoden' )
    ,( the_country_id, 'Canton', 'AR', 'Appenzell Ausserrhoden' )
    ,( the_country_id, 'Canton', 'BE', 'Bern' )
    ,( the_country_id, 'Canton', 'BL', 'Basel-Landschaft' )
    ,( the_country_id, 'Canton', 'BS', 'Basel-Stadt' )
    ,( the_country_id, 'Canton', 'FR', 'Fribourg' )
    ,( the_country_id, 'Canton', 'GE', 'Genève' )
    ,( the_country_id, 'Canton', 'GL', 'Glarus' )
    ,( the_country_id, 'Canton', 'GR', 'Graubünden' )
    ,( the_country_id, 'Canton', 'JU', 'Jura' )
    ,( the_country_id, 'Canton', 'LU', 'Luzern' )
    ,( the_country_id, 'Canton', 'NE', 'Neuchâtel' )
    ,( the_country_id, 'Canton', 'NW', 'Nidwalden' )
    ,( the_country_id, 'Canton', 'OW', 'Obwalden' )
    ,( the_country_id, 'Canton', 'SG', 'Sankt Gallen' )
    ,( the_country_id, 'Canton', 'SH', 'Schaffhausen' )
    ,( the_country_id, 'Canton', 'SO', 'Solothurn' )
    ,( the_country_id, 'Canton', 'SZ', 'Schwyz' )
    ,( the_country_id, 'Canton', 'TG', 'Thurgau' )
    ,( the_country_id, 'Canton', 'TI', 'Ticino' )
    ,( the_country_id, 'Canton', 'UR', 'Uri' )
    ,( the_country_id, 'Canton', 'VD', 'Vaud' )
    ,( the_country_id, 'Canton', 'VS', 'Valais' )
    ,( the_country_id, 'Canton', 'ZG', 'Zug' )
    ,( the_country_id, 'Canton', 'ZH', 'Zürich' );
    
    -- Côte d'Ivoire
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'CI' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', '01', 'Lagunes (Région des)' )
    ,( the_country_id, 'Region', '02', 'Haut-Sassandra (Région du)' )
    ,( the_country_id, 'Region', '03', 'Savanes (Région des)' )
    ,( the_country_id, 'Region', '04', 'Vallée du Bandama (Région de la)' )
    ,( the_country_id, 'Region', '05', 'Moyen-Comoé (Région du)' )
    ,( the_country_id, 'Region', '06', '18 Montagnes (Région des)' )
    ,( the_country_id, 'Region', '07', 'Lacs (Région des)' )
    ,( the_country_id, 'Region', '08', 'Zanzan (Région du)' )
    ,( the_country_id, 'Region', '09', 'Bas-Sassandra (Région du)' )
    ,( the_country_id, 'Region', '10', 'Denguélé (Région du)' )
    ,( the_country_id, 'Region', '11', 'Nzi-Comoé (Région)' )
    ,( the_country_id, 'Region', '12', 'Marahoué (Région de la)' )
    ,( the_country_id, 'Region', '13', 'Sud-Comoé (Région du)' )
    ,( the_country_id, 'Region', '14', 'Worodougou (Région du)' )
    ,( the_country_id, 'Region', '15', 'Sud-Bandama (Région du)' )
    ,( the_country_id, 'Region', '16', 'Agnébi (Région de l'')' )
    ,( the_country_id, 'Region', '17', 'Bafing (Région du)' )
    ,( the_country_id, 'Region', '18', 'Fromager (Région du)' )
    ,( the_country_id, 'Region', '19', 'Moyen-Cavally (Région du)' );
    
    -- Chile
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'CL' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'AI', 'Aysén' )
    ,( the_country_id, 'Region', 'AN', 'Antofagasta' )
    ,( the_country_id, 'Region', 'AP', 'Arica y Parinacota' )
    ,( the_country_id, 'Region', 'AR', 'Araucanía' )
    ,( the_country_id, 'Region', 'AT', 'Atacama' )
    ,( the_country_id, 'Region', 'BI', 'Biobío' )
    ,( the_country_id, 'Region', 'CO', 'Coquimbo' )
    ,( the_country_id, 'Region', 'LI', 'Libertador General Bernardo O''Higgins' )
    ,( the_country_id, 'Region', 'LL', 'Los Lagos' )
    ,( the_country_id, 'Region', 'LR', 'Los Ríos' )
    ,( the_country_id, 'Region', 'MA', 'Magallanes' )
    ,( the_country_id, 'Region', 'ML', 'Maule' )
    ,( the_country_id, 'Region', 'RM', 'Región Metropolitana de Santiago' )
    ,( the_country_id, 'Region', 'TA', 'Tarapacá' )
    ,( the_country_id, 'Region', 'VS', 'Valparaíso' );
    
    -- Cameroon
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'CM' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'AD', 'Adamaoua' )
    ,( the_country_id, 'Region', 'CE', 'Centre' )
    ,( the_country_id, 'Region', 'EN', 'Far North' )
    ,( the_country_id, 'Region', 'ES', 'East' )
    ,( the_country_id, 'Region', 'LT', 'Littoral' )
    ,( the_country_id, 'Region', 'NO', 'North' )
    ,( the_country_id, 'Region', 'NW', 'North-West' )
    ,( the_country_id, 'Region', 'OU', 'West' )
    ,( the_country_id, 'Region', 'SU', 'South' )
    ,( the_country_id, 'Region', 'SW', 'South-West' );
    
    -- China
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'CN' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Municipality', '11', 'Beijing' )
    ,( the_country_id, 'Municipality', '12', 'Tianjin' )
    ,( the_country_id, 'Province', '13', 'Hebei' )
    ,( the_country_id, 'Province', '14', 'Shanxi' )
    ,( the_country_id, 'Autonomous Region', '15', 'Nei Mongol' )
    ,( the_country_id, 'Province', '21', 'Liaoning' )
    ,( the_country_id, 'Province', '22', 'Jilin' )
    ,( the_country_id, 'Province', '23', 'Heilongjiang' )
    ,( the_country_id, 'Municipality', '31', 'Shanghai' )
    ,( the_country_id, 'Province', '32', 'Jiangsu' )
    ,( the_country_id, 'Province', '33', 'Zhejiang' )
    ,( the_country_id, 'Province', '34', 'Anhui' )
    ,( the_country_id, 'Province', '35', 'Fujian' )
    ,( the_country_id, 'Province', '36', 'Jiangxi' )
    ,( the_country_id, 'Province', '37', 'Shandong' )
    ,( the_country_id, 'Province', '41', 'Henan' )
    ,( the_country_id, 'Province', '42', 'Hubei' )
    ,( the_country_id, 'Province', '43', 'Hunan' )
    ,( the_country_id, 'Province', '44', 'Guangdong' )
    ,( the_country_id, 'Autonomous Region', '45', 'Guangxi' )
    ,( the_country_id, 'Province', '46', 'Hainan' )
    ,( the_country_id, 'Municipality', '50', 'Chongqing' )
    ,( the_country_id, 'Province', '51', 'Sichuan' )
    ,( the_country_id, 'Province', '52', 'Guizhou' )
    ,( the_country_id, 'Province', '53', 'Yunnan' )
    ,( the_country_id, 'Autonomous Region', '54', 'Xizang' )
    ,( the_country_id, 'Province', '61', 'Shaanxi' )
    ,( the_country_id, 'Province', '62', 'Gansu' )
    ,( the_country_id, 'Province', '63', 'Qinghai' )
    ,( the_country_id, 'Autonomous Region', '64', 'Ningxia' )
    ,( the_country_id, 'Autonomous Region', '65', 'Xinjiang' )
    ,( the_country_id, 'Province', '71', 'Taiwan' )
    ,( the_country_id, 'Special Administrative Region', '91', 'Xianggang' )
    ,( the_country_id, 'Special Administrative Region', '92', 'Aomen' );
    
    -- Colombia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'CO' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Department', 'AMA', 'Amazonas' )
    ,( the_country_id, 'Department', 'ANT', 'Antioquia' )
    ,( the_country_id, 'Department', 'ARA', 'Arauca' )
    ,( the_country_id, 'Department', 'ATL', 'Atlántico' )
    ,( the_country_id, 'Department', 'BOL', 'Bolívar' )
    ,( the_country_id, 'Department', 'BOY', 'Boyacá' )
    ,( the_country_id, 'Department', 'CAL', 'Caldas' )
    ,( the_country_id, 'Department', 'CAQ', 'Caquetá' )
    ,( the_country_id, 'Department', 'CAS', 'Casanare' )
    ,( the_country_id, 'Department', 'CAU', 'Cauca' )
    ,( the_country_id, 'Department', 'CES', 'Cesar' )
    ,( the_country_id, 'Department', 'CHO', 'Chocó' )
    ,( the_country_id, 'Department', 'COR', 'Córdoba' )
    ,( the_country_id, 'Department', 'CUN', 'Cundinamarca' )
    ,( the_country_id, 'Capital district', 'DC', 'Distrito Capital de Bogotá' )
    ,( the_country_id, 'Department', 'GUA', 'Guainía' )
    ,( the_country_id, 'Department', 'GUV', 'Guaviare' )
    ,( the_country_id, 'Department', 'HUI', 'Huila' )
    ,( the_country_id, 'Department', 'LAG', 'La Guajira' )
    ,( the_country_id, 'Department', 'MAG', 'Magdalena' )
    ,( the_country_id, 'Department', 'MET', 'Meta' )
    ,( the_country_id, 'Department', 'NAR', 'Nariño' )
    ,( the_country_id, 'Department', 'NSA', 'Norte de Santander' )
    ,( the_country_id, 'Department', 'PUT', 'Putumayo' )
    ,( the_country_id, 'Department', 'QUI', 'Quindío' )
    ,( the_country_id, 'Department', 'RIS', 'Risaralda' )
    ,( the_country_id, 'Department', 'SAN', 'Santander' )
    ,( the_country_id, 'Department', 'SAP', 'San Andrés, Providencia y Santa Catalina' )
    ,( the_country_id, 'Department', 'SUC', 'Sucre' )
    ,( the_country_id, 'Department', 'TOL', 'Tolima' )
    ,( the_country_id, 'Department', 'VAC', 'Valle del Cauca' )
    ,( the_country_id, 'Department', 'VAU', 'Vaupés' )
    ,( the_country_id, 'Department', 'VID', 'Vichada' );
    
    -- Costa Rica
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'CR' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'A', 'Alajuela' )
    ,( the_country_id, 'Province', 'C', 'Cartago' )
    ,( the_country_id, 'Province', 'G', 'Guanacaste' )
    ,( the_country_id, 'Province', 'H', 'Heredia' )
    ,( the_country_id, 'Province', 'L', 'Limón' )
    ,( the_country_id, 'Province', 'P', 'Puntarenas' )
    ,( the_country_id, 'Province', 'SJ', 'San José' );
    
    -- Cuba
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'CU' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', '01', 'Pinar del Río' )
    ,( the_country_id, 'Province', '02', 'La Habana' )
    ,( the_country_id, 'Province', '03', 'Ciudad de La Habana' )
    ,( the_country_id, 'Province', '04', 'Matanzas' )
    ,( the_country_id, 'Province', '05', 'Villa Clara' )
    ,( the_country_id, 'Province', '06', 'Cienfuegos' )
    ,( the_country_id, 'Province', '07', 'Sancti Spíritus' )
    ,( the_country_id, 'Province', '08', 'Ciego de Ávila' )
    ,( the_country_id, 'Province', '09', 'Camagüey' )
    ,( the_country_id, 'Province', '10', 'Las Tunas' )
    ,( the_country_id, 'Province', '11', 'Holguín' )
    ,( the_country_id, 'Province', '12', 'Granma' )
    ,( the_country_id, 'Province', '13', 'Santiago de Cuba' )
    ,( the_country_id, 'Province', '14', 'Guantánamo' )
    ,( the_country_id, 'Province', '15', 'Artemisa' )
    ,( the_country_id, 'Province', '16', 'Mayabeque' )
    ,( the_country_id, 'Special municipality', '99', 'Isla de la Juventud' );
    
    -- Cabo Verde
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'CV' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Municipality', 'BR', 'Brava' )
    ,( the_country_id, 'Municipality', 'BV', 'Boa Vista' )
    ,( the_country_id, 'Municipality', 'CA', 'Santa Catarina' )
    ,( the_country_id, 'Municipality', 'CF', 'Santa Catarina do Fogo' )
    ,( the_country_id, 'Municipality', 'CR', 'Santa Cruz' )
    ,( the_country_id, 'Municipality', 'MA', 'Maio' )
    ,( the_country_id, 'Municipality', 'MO', 'Mosteiros' )
    ,( the_country_id, 'Municipality', 'PA', 'Paul' )
    ,( the_country_id, 'Municipality', 'PN', 'Porto Novo' )
    ,( the_country_id, 'Municipality', 'PR', 'Praia' )
    ,( the_country_id, 'Municipality', 'RB', 'Ribeira Brava' )
    ,( the_country_id, 'Municipality', 'RG', 'Ribeira Grande' )
    ,( the_country_id, 'Municipality', 'RS', 'Ribeira Grande de Santiago' )
    ,( the_country_id, 'Municipality', 'SD', 'São Domingos' )
    ,( the_country_id, 'Municipality', 'SF', 'São Filipe' )
    ,( the_country_id, 'Municipality', 'SL', 'Sal' )
    ,( the_country_id, 'Municipality', 'SM', 'São Miguel' )
    ,( the_country_id, 'Municipality', 'SO', 'São Lourenço dos Órgãos' )
    ,( the_country_id, 'Municipality', 'SS', 'São Salvador do Mundo' )
    ,( the_country_id, 'Municipality', 'SV', 'São Vicente' )
    ,( the_country_id, 'Municipality', 'TA', 'Tarrafal' )
    ,( the_country_id, 'Municipality', 'TS', 'Tarrafal de São Nicolau' );
    
    -- Cyprus
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'CY' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', '01', 'Lefkosia' )
    ,( the_country_id, 'District', '02', 'Lemesos' )
    ,( the_country_id, 'District', '03', 'Larnaka' )
    ,( the_country_id, 'District', '04', 'Ammochostos' )
    ,( the_country_id, 'District', '05', 'Pafos' )
    ,( the_country_id, 'District', '06', 'Keryneia' );
    
    -- Czech Republic
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'CZ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'JC', 'Jihoceský kraj' )
    ,( the_country_id, 'Region', 'JM', 'Jihomoravský kraj' )
    ,( the_country_id, 'Region', 'KA', 'Karlovarský kraj' )
    ,( the_country_id, 'Region', 'KR', 'Královéhradecký kraj' )
    ,( the_country_id, 'Region', 'LI', 'Liberecký kraj' )
    ,( the_country_id, 'Region', 'MO', 'Moravskoslezský kraj' )
    ,( the_country_id, 'Region', 'OL', 'Olomoucký kraj' )
    ,( the_country_id, 'Region', 'PA', 'Pardubický kraj' )
    ,( the_country_id, 'Region', 'PL', 'Plzenský kraj' )
    ,( the_country_id, 'Region', 'PR', 'Praha, hlavní mesto' )
    ,( the_country_id, 'Region', 'ST', 'Stredoceský kraj' )
    ,( the_country_id, 'Region', 'US', 'Ústecký kraj' )
    ,( the_country_id, 'Region', 'VY', 'Vysocina' )
    ,( the_country_id, 'Region', 'ZL', 'Zlínský kraj' );
    
    -- Germany
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'DE' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Länder', 'BB', 'Brandenburg' )
    ,( the_country_id, 'Länder', 'BE', 'Berlin' )
    ,( the_country_id, 'Länder', 'BW', 'Baden-Württemberg' )
    ,( the_country_id, 'Länder', 'BY', 'Bayern' )
    ,( the_country_id, 'Länder', 'HB', 'Bremen' )
    ,( the_country_id, 'Länder', 'HE', 'Hessen' )
    ,( the_country_id, 'Länder', 'HH', 'Hamburg' )
    ,( the_country_id, 'Länder', 'MV', 'Mecklenburg-Vorpommern' )
    ,( the_country_id, 'Länder', 'NI', 'Niedersachsen' )
    ,( the_country_id, 'Länder', 'NW', 'Nordrhein-Westfalen' )
    ,( the_country_id, 'Länder', 'RP', 'Rheinland-Pfalz' )
    ,( the_country_id, 'Länder', 'SH', 'Schleswig-Holstein' )
    ,( the_country_id, 'Länder', 'SL', 'Saarland' )
    ,( the_country_id, 'Länder', 'SN', 'Sachsen' )
    ,( the_country_id, 'Länder', 'ST', 'Sachsen-Anhalt' )
    ,( the_country_id, 'Länder', 'TH', 'Thüringen' );
    
    -- Djibouti
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'DJ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'AR', 'Arta' )
    ,( the_country_id, 'Region', 'AS', 'Ali Sabieh' )
    ,( the_country_id, 'Region', 'DI', 'Dikhil' )
    ,( the_country_id, 'City', 'DJ', 'Djibouti' )
    ,( the_country_id, 'Region', 'OB', 'Obock' )
    ,( the_country_id, 'Region', 'TA', 'Tadjourah' );
    
    -- Denmark
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'DK' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', '81', 'Nordjylland' )
    ,( the_country_id, 'Region', '82', 'Midtjylland' )
    ,( the_country_id, 'Region', '83', 'Syddanmark' )
    ,( the_country_id, 'Region', '84', 'Hovedstaden' )
    ,( the_country_id, 'Region', '85', 'Sjælland' );
    
    -- Dominica
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'DM' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Parish', '02', 'Saint Andrew' )
    ,( the_country_id, 'Parish', '03', 'Saint David' )
    ,( the_country_id, 'Parish', '04', 'Saint George' )
    ,( the_country_id, 'Parish', '05', 'Saint John' )
    ,( the_country_id, 'Parish', '06', 'Saint Joseph' )
    ,( the_country_id, 'Parish', '07', 'Saint Luke' )
    ,( the_country_id, 'Parish', '08', 'Saint Mark' )
    ,( the_country_id, 'Parish', '09', 'Saint Patrick' )
    ,( the_country_id, 'Parish', '10', 'Saint Paul' )
    ,( the_country_id, 'Parish', '11', 'Saint Peter' );
    
    -- Dominican Republic
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'DO' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', '01', 'Distrito Nacional (Santo Domingo)' )
    ,( the_country_id, 'Province', '02', 'Azua' )
    ,( the_country_id, 'Province', '03', 'Baoruco' )
    ,( the_country_id, 'Province', '04', 'Barahona' )
    ,( the_country_id, 'Province', '05', 'Dajabón' )
    ,( the_country_id, 'Province', '06', 'Duarte' )
    ,( the_country_id, 'Province', '07', 'La Estrelleta [Elías Piña]' )
    ,( the_country_id, 'Province', '08', 'El Seibo' )
    ,( the_country_id, 'Province', '09', 'Espaillat' )
    ,( the_country_id, 'Province', '10', 'Independencia' )
    ,( the_country_id, 'Province', '11', 'La Altagracia' )
    ,( the_country_id, 'Province', '12', 'La Romana' )
    ,( the_country_id, 'Province', '13', 'La Vega' )
    ,( the_country_id, 'Province', '14', 'María Trinidad Sánchez' )
    ,( the_country_id, 'Province', '15', 'Monte Cristi' )
    ,( the_country_id, 'Province', '16', 'Pedernales' )
    ,( the_country_id, 'Province', '17', 'Peravia' )
    ,( the_country_id, 'Province', '18', 'Puerto Plata' )
    ,( the_country_id, 'Province', '19', 'Hermanas Mirabal' )
    ,( the_country_id, 'Province', '20', 'Samaná' )
    ,( the_country_id, 'Province', '21', 'San Cristóbal' )
    ,( the_country_id, 'Province', '22', 'San Juan' )
    ,( the_country_id, 'Province', '23', 'San Pedro de Macorís' )
    ,( the_country_id, 'Province', '24', 'Sánchez Ramírez' )
    ,( the_country_id, 'Province', '25', 'Santiago' )
    ,( the_country_id, 'Province', '26', 'Santiago Rodríguez' )
    ,( the_country_id, 'Province', '27', 'Valverde' )
    ,( the_country_id, 'Province', '28', 'Monseñor Nouel' )
    ,( the_country_id, 'Province', '29', 'Monte Plata' )
    ,( the_country_id, 'Province', '30', 'Hato Mayor' )
    ,( the_country_id, 'Province', '31', 'San José de Ocoa' )
    ,( the_country_id, 'Province', '32', 'Santo Domingo' )
    ,( the_country_id, 'Region', '33', 'Cibao Nordeste' )
    ,( the_country_id, 'Region', '34', 'Cibao Noroeste' )
    ,( the_country_id, 'Region', '35', 'Cibao Norte' )
    ,( the_country_id, 'Region', '36', 'Cibao Sur' )
    ,( the_country_id, 'Region', '37', 'El Valle' )
    ,( the_country_id, 'Region', '38', 'Enriquillo' )
    ,( the_country_id, 'Region', '39', 'Higuamo' )
    ,( the_country_id, 'Region', '40', 'Ozama' )
    ,( the_country_id, 'Region', '41', 'Valdesia' )
    ,( the_country_id, 'Region', '42', 'Yuma' );
    
    -- Algeria
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'DZ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', '01', 'Adrar' )
    ,( the_country_id, 'Province', '02', 'Chlef' )
    ,( the_country_id, 'Province', '03', 'Laghouat' )
    ,( the_country_id, 'Province', '04', 'Oum el Bouaghi' )
    ,( the_country_id, 'Province', '05', 'Batna' )
    ,( the_country_id, 'Province', '06', 'Béjaïa' )
    ,( the_country_id, 'Province', '07', 'Biskra' )
    ,( the_country_id, 'Province', '08', 'Béchar' )
    ,( the_country_id, 'Province', '09', 'Blida' )
    ,( the_country_id, 'Province', '10', 'Bouira' )
    ,( the_country_id, 'Province', '11', 'Tamanrasset' )
    ,( the_country_id, 'Province', '12', 'Tébessa' )
    ,( the_country_id, 'Province', '13', 'Tlemcen' )
    ,( the_country_id, 'Province', '14', 'Tiaret' )
    ,( the_country_id, 'Province', '15', 'Tizi Ouzou' )
    ,( the_country_id, 'Province', '16', 'Alger' )
    ,( the_country_id, 'Province', '17', 'Djelfa' )
    ,( the_country_id, 'Province', '18', 'Jijel' )
    ,( the_country_id, 'Province', '19', 'Sétif' )
    ,( the_country_id, 'Province', '20', 'Saïda' )
    ,( the_country_id, 'Province', '21', 'Skikda' )
    ,( the_country_id, 'Province', '22', 'Sidi Bel Abbès' )
    ,( the_country_id, 'Province', '23', 'Annaba' )
    ,( the_country_id, 'Province', '24', 'Guelma' )
    ,( the_country_id, 'Province', '25', 'Constantine' )
    ,( the_country_id, 'Province', '26', 'Médéa' )
    ,( the_country_id, 'Province', '27', 'Mostaganem' )
    ,( the_country_id, 'Province', '28', 'Msila' )
    ,( the_country_id, 'Province', '29', 'Mascara' )
    ,( the_country_id, 'Province', '30', 'Ouargla' )
    ,( the_country_id, 'Province', '31', 'Oran' )
    ,( the_country_id, 'Province', '32', 'El Bayadh' )
    ,( the_country_id, 'Province', '33', 'Illizi' )
    ,( the_country_id, 'Province', '34', 'Bordj Bou Arréridj' )
    ,( the_country_id, 'Province', '35', 'Boumerdès' )
    ,( the_country_id, 'Province', '36', 'El Tarf' )
    ,( the_country_id, 'Province', '37', 'Tindouf' )
    ,( the_country_id, 'Province', '38', 'Tissemsilt' )
    ,( the_country_id, 'Province', '39', 'El Oued' )
    ,( the_country_id, 'Province', '40', 'Khenchela' )
    ,( the_country_id, 'Province', '41', 'Souk Ahras' )
    ,( the_country_id, 'Province', '42', 'Tipaza' )
    ,( the_country_id, 'Province', '43', 'Mila' )
    ,( the_country_id, 'Province', '44', 'Aïn Defla' )
    ,( the_country_id, 'Province', '45', 'Naama' )
    ,( the_country_id, 'Province', '46', 'Aïn Témouchent' )
    ,( the_country_id, 'Province', '47', 'Ghardaïa' )
    ,( the_country_id, 'Province', '48', 'Relizane' );
    
    -- Ecuador
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'EC' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'A', 'Azuay' )
    ,( the_country_id, 'Province', 'B', 'Bolívar' )
    ,( the_country_id, 'Province', 'C', 'Carchi' )
    ,( the_country_id, 'Province', 'D', 'Orellana' )
    ,( the_country_id, 'Province', 'E', 'Esmeraldas' )
    ,( the_country_id, 'Province', 'F', 'Cañar' )
    ,( the_country_id, 'Province', 'G', 'Guayas' )
    ,( the_country_id, 'Province', 'H', 'Chimborazo' )
    ,( the_country_id, 'Province', 'I', 'Imbabura' )
    ,( the_country_id, 'Province', 'L', 'Loja' )
    ,( the_country_id, 'Province', 'M', 'Manabí' )
    ,( the_country_id, 'Province', 'N', 'Napo' )
    ,( the_country_id, 'Province', 'O', 'El Oro' )
    ,( the_country_id, 'Province', 'P', 'Pichincha' )
    ,( the_country_id, 'Province', 'R', 'Los Ríos' )
    ,( the_country_id, 'Province', 'S', 'Morona-Santiago' )
    ,( the_country_id, 'Province', 'SD', 'Santo Domingo de los Tsáchilas' )
    ,( the_country_id, 'Province', 'SE', 'Santa Elena' )
    ,( the_country_id, 'Province', 'T', 'Tungurahua' )
    ,( the_country_id, 'Province', 'U', 'Sucumbíos' )
    ,( the_country_id, 'Province', 'W', 'Galápagos' )
    ,( the_country_id, 'Province', 'X', 'Cotopaxi' )
    ,( the_country_id, 'Province', 'Y', 'Pastaza' )
    ,( the_country_id, 'Province', 'Z', 'Zamora-Chinchipe' );
    
    -- Estonia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'EE' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'County', '37', 'Harjumaa' )
    ,( the_country_id, 'County', '39', 'Hiiumaa' )
    ,( the_country_id, 'County', '44', 'Ida-Virumaa' )
    ,( the_country_id, 'County', '49', 'Jõgevamaa' )
    ,( the_country_id, 'County', '51', 'Järvamaa' )
    ,( the_country_id, 'County', '57', 'Läänemaa' )
    ,( the_country_id, 'County', '59', 'Lääne-Virumaa' )
    ,( the_country_id, 'County', '65', 'Põlvamaa' )
    ,( the_country_id, 'County', '67', 'Pärnumaa' )
    ,( the_country_id, 'County', '70', 'Raplamaa' )
    ,( the_country_id, 'County', '74', 'Saaremaa' )
    ,( the_country_id, 'County', '78', 'Tartumaa' )
    ,( the_country_id, 'County', '82', 'Valgamaa' )
    ,( the_country_id, 'County', '84', 'Viljandimaa' )
    ,( the_country_id, 'County', '86', 'Võrumaa' );
    
    -- Egypt
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'EG' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Governorate', 'ALX', 'AI Iskandariyah' )
    ,( the_country_id, 'Governorate', 'ASN', 'Aswan' )
    ,( the_country_id, 'Governorate', 'AST', 'Asyut' )
    ,( the_country_id, 'Governorate', 'BA', 'Al Baḩr al Aḩmar' )
    ,( the_country_id, 'Governorate', 'BH', 'Al Buḩayrah' )
    ,( the_country_id, 'Governorate', 'BNS', 'Bani Suwayf' )
    ,( the_country_id, 'Governorate', 'C', 'AI Qahirah' )
    ,( the_country_id, 'Governorate', 'DK', 'Ad Daqahliyah' )
    ,( the_country_id, 'Governorate', 'DT', 'Dumyat' )
    ,( the_country_id, 'Governorate', 'FYM', 'AI Fayyum' )
    ,( the_country_id, 'Governorate', 'GH', 'AI Gharbiyah' )
    ,( the_country_id, 'Governorate', 'GZ', 'AI Jizah' )
    ,( the_country_id, 'Governorate', 'IS', 'AI Isma ''iliyah' )
    ,( the_country_id, 'Governorate', 'JS', 'Janub Sina''' )
    ,( the_country_id, 'Governorate', 'KB', 'AI Qalyubiyah' )
    ,( the_country_id, 'Governorate', 'KFS', 'Kafr ash Shaykh' )
    ,( the_country_id, 'Governorate', 'KN', 'Qina' )
    ,( the_country_id, 'Governorate', 'LX', 'Al Uqsur' )
    ,( the_country_id, 'Governorate', 'MN', 'AI Minya' )
    ,( the_country_id, 'Governorate', 'MNF', 'AI Minufiyah' )
    ,( the_country_id, 'Governorate', 'MT', 'Matruh' )
    ,( the_country_id, 'Governorate', 'PTS', 'Bur Sa''id' )
    ,( the_country_id, 'Governorate', 'SHG', 'Suhaj' )
    ,( the_country_id, 'Governorate', 'SHR', 'Ash Sharqiyah' )
    ,( the_country_id, 'Governorate', 'SIN', 'Shamal Sina''' )
    ,( the_country_id, 'Governorate', 'SUZ', 'As Suways' )
    ,( the_country_id, 'Governorate', 'WAD', 'AI Wadi al Jadid' );
    
    -- Eritrea
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'ER' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'AN', '‘Anseba' )
    ,( the_country_id, 'Region', 'DK', 'Debubawi K’eyyĭḥ Baḥri' )
    ,( the_country_id, 'Region', 'DU', 'Debub' )
    ,( the_country_id, 'Region', 'GB', 'Gash-Barka' )
    ,( the_country_id, 'Region', 'MA', 'Ma’ikel' )
    ,( the_country_id, 'Region', 'SK', 'Semienawi K’eyyĭḥ Baḥri' );
    
    -- Spain
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'ES' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'A', 'Alicante / Alacant' )
    ,( the_country_id, 'Province', 'AB', 'Albacete' )
    ,( the_country_id, 'Province', 'AL', 'Almería' )
    ,( the_country_id, 'Province', 'AV', 'Ávila' )
    ,( the_country_id, 'Province', 'B', 'Barcelona  [Barcelona]' )
    ,( the_country_id, 'Province', 'BA', 'Badajoz' )
    ,( the_country_id, 'Province', 'BI', 'Biskaia' )
    ,( the_country_id, 'Province', 'BU', 'Burgos' )
    ,( the_country_id, 'Province', 'C', 'A Coruña  [La Coruña]' )
    ,( the_country_id, 'Province', 'CA', 'Cádiz' )
    ,( the_country_id, 'Province', 'CC', 'Cáceres' )
    ,( the_country_id, 'Autonomous city in North Africa', 'CE', 'Ceuta' )
    ,( the_country_id, 'Province', 'CO', 'Córdoba' )
    ,( the_country_id, 'Province', 'CR', 'Ciudad Real' )
    ,( the_country_id, 'Province', 'CS', 'Castellón / Castelló' )
    ,( the_country_id, 'Province', 'CU', 'Cuenca' )
    ,( the_country_id, 'Province', 'GC', 'Las Palmas' )
    ,( the_country_id, 'Province', 'GI', 'Girona  [Gerona]' )
    ,( the_country_id, 'Province', 'GR', 'Granada' )
    ,( the_country_id, 'Province', 'GU', 'Guadalajara' )
    ,( the_country_id, 'Province', 'H', 'Huelva' )
    ,( the_country_id, 'Province', 'HU', 'Huesca' )
    ,( the_country_id, 'Province', 'J', 'Jaén' )
    ,( the_country_id, 'Province', 'L', 'Lleida  [Lérida]' )
    ,( the_country_id, 'Province', 'LE', 'León' )
    ,( the_country_id, 'Province', 'LO', 'La Rioja' )
    ,( the_country_id, 'Province', 'LU', 'Lugo  [Lugo]' )
    ,( the_country_id, 'Province', 'M', 'Madrid' )
    ,( the_country_id, 'Province', 'MA', 'Málaga' )
    ,( the_country_id, 'Autonomous city in North Africa', 'ML', 'Melilla' )
    ,( the_country_id, 'Province', 'MU', 'Murcia' )
    ,( the_country_id, 'Province', 'NA', 'Navarra / Nafarroa' )
    ,( the_country_id, 'Province', 'O', 'Asturias' )
    ,( the_country_id, 'Province', 'OR', 'Ourense  [Orense]' )
    ,( the_country_id, 'Province', 'P', 'Palencia' )
    ,( the_country_id, 'Province', 'PM', 'Balears  [Baleares]' )
    ,( the_country_id, 'Province', 'PO', 'Pontevedra  [Pontevedra]' )
    ,( the_country_id, 'Province', 'S', 'Cantabria' )
    ,( the_country_id, 'Province', 'SA', 'Salamanca' )
    ,( the_country_id, 'Province', 'SE', 'Sevilla' )
    ,( the_country_id, 'Province', 'SG', 'Segovia' )
    ,( the_country_id, 'Province', 'SO', 'Soria' )
    ,( the_country_id, 'Province', 'SS', 'Gipuzkoa' )
    ,( the_country_id, 'Province', 'T', 'Tarragona  [Tarragona]' )
    ,( the_country_id, 'Province', 'TE', 'Teruel' )
    ,( the_country_id, 'Province', 'TF', 'Santa Cruz de Tenerife' )
    ,( the_country_id, 'Province', 'TO', 'Toledo' )
    ,( the_country_id, 'Province', 'V', 'Valencia / València' )
    ,( the_country_id, 'Province', 'VA', 'Valladolid' )
    ,( the_country_id, 'Province', 'VI', 'Álava / Araba' )
    ,( the_country_id, 'Province', 'Z', 'Zaragoza' )
    ,( the_country_id, 'Province', 'ZA', 'Zamora' );
    
    -- Ethiopia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'ET' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Administration', 'AA', 'Adis Abeba' )
    ,( the_country_id, 'State', 'AF', 'Afar' )
    ,( the_country_id, 'State', 'AM', 'Amara' )
    ,( the_country_id, 'State', 'BE', 'Binshangul Gumuz' )
    ,( the_country_id, 'Administration', 'DD', 'Dire Dawa' )
    ,( the_country_id, 'State', 'GA', 'Gambela Hizboch' )
    ,( the_country_id, 'State', 'HA', 'Hareri Hizb' )
    ,( the_country_id, 'State', 'OR', 'Oromiya' )
    ,( the_country_id, 'State', 'SN', 'YeDebub Biheroch Bihereseboch na Hizboch' )
    ,( the_country_id, 'State', 'SO', 'Sumale' )
    ,( the_country_id, 'State', 'TI', 'Tigray' );
    
    -- Finland
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'FI' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', '01', 'Ahvenanmaan maakunta' )
    ,( the_country_id, 'Region', '02', 'Etelä-Karjala' )
    ,( the_country_id, 'Region', '03', 'Etelä-Pohjanmaa' )
    ,( the_country_id, 'Region', '04', 'Etelä-Savo' )
    ,( the_country_id, 'Region', '05', 'Kainuu' )
    ,( the_country_id, 'Region', '06', 'Kanta-Häme' )
    ,( the_country_id, 'Region', '07', 'Keski-Pohjanmaa' )
    ,( the_country_id, 'Region', '08', 'Keski-Suomi' )
    ,( the_country_id, 'Region', '09', 'Kymenlaakso' )
    ,( the_country_id, 'Region', '10', 'Lappi' )
    ,( the_country_id, 'Region', '11', 'Pirkanmaa' )
    ,( the_country_id, 'Region', '12', 'Pohjanmaa' )
    ,( the_country_id, 'Region', '13', 'Pohjois-Karjala' )
    ,( the_country_id, 'Region', '14', 'Pohjois-Pohjanmaa' )
    ,( the_country_id, 'Region', '15', 'Pohjois-Savo' )
    ,( the_country_id, 'Region', '16', 'Päijät-Häme' )
    ,( the_country_id, 'Region', '17', 'Satakunta' )
    ,( the_country_id, 'Region', '18', 'Uusimaa' )
    ,( the_country_id, 'Region', '19', 'Varsinais-Suomi' );
    
    -- Fiji
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'FJ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', '01', 'Ba' )
    ,( the_country_id, 'Province', '02', 'Bua' )
    ,( the_country_id, 'Province', '03', 'Cakaudrove' )
    ,( the_country_id, 'Province', '04', 'Kadavu' )
    ,( the_country_id, 'Province', '05', 'Lau' )
    ,( the_country_id, 'Province', '06', 'Lomaiviti' )
    ,( the_country_id, 'Province', '07', 'Macuata' )
    ,( the_country_id, 'Province', '08', 'Nadroga and Navosa' )
    ,( the_country_id, 'Province', '09', 'Naitasiri' )
    ,( the_country_id, 'Province', '10', 'Namosi' )
    ,( the_country_id, 'Province', '11', 'Ra' )
    ,( the_country_id, 'Province', '12', 'Rewa' )
    ,( the_country_id, 'Province', '13', 'Serua' )
    ,( the_country_id, 'Province', '14', 'Tailevu' )
    ,( the_country_id, 'Division', 'C', 'Central' )
    ,( the_country_id, 'Division', 'E', 'Eastern' )
    ,( the_country_id, 'Division', 'N', 'Northern' )
    ,( the_country_id, 'Dependency', 'R', 'Rotuma' )
    ,( the_country_id, 'Division', 'W', 'Western' );
    
    -- Micronesia (Federated States of)
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'FM' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'State', 'KSA', 'Kosrae' )
    ,( the_country_id, 'State', 'PNI', 'Pohnpei' )
    ,( the_country_id, 'State', 'TRK', 'Chuuk' )
    ,( the_country_id, 'State', 'YAP', 'Yap' );
    
    -- France
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'FR' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Metropolitan department', '01', 'Ain' )
    ,( the_country_id, 'Metropolitan department', '02', 'Aisne' )
    ,( the_country_id, 'Metropolitan department', '03', 'Allier' )
    ,( the_country_id, 'Metropolitan department', '04', 'Alpes-de-Haute-Provence' )
    ,( the_country_id, 'Metropolitan department', '05', 'Hautes-Alpes' )
    ,( the_country_id, 'Metropolitan department', '06', 'Alpes-Maritimes' )
    ,( the_country_id, 'Metropolitan department', '07', 'Ardèche' )
    ,( the_country_id, 'Metropolitan department', '08', 'Ardennes' )
    ,( the_country_id, 'Metropolitan department', '09', 'Ariège' )
    ,( the_country_id, 'Metropolitan department', '10', 'Aube' )
    ,( the_country_id, 'Metropolitan department', '11', 'Aude' )
    ,( the_country_id, 'Metropolitan department', '12', 'Aveyron' )
    ,( the_country_id, 'Metropolitan department', '13', 'Bouches-du-Rhône' )
    ,( the_country_id, 'Metropolitan department', '14', 'Calvados' )
    ,( the_country_id, 'Metropolitan department', '15', 'Cantal' )
    ,( the_country_id, 'Metropolitan department', '16', 'Charente' )
    ,( the_country_id, 'Metropolitan department', '17', 'Charente-Maritime' )
    ,( the_country_id, 'Metropolitan department', '18', 'Cher' )
    ,( the_country_id, 'Metropolitan department', '19', 'Corrèze' )
    ,( the_country_id, 'Metropolitan department', '21', 'Côte-d''Or' )
    ,( the_country_id, 'Metropolitan department', '22', 'Côtes-d''Armor' )
    ,( the_country_id, 'Metropolitan department', '23', 'Creuse' )
    ,( the_country_id, 'Metropolitan department', '24', 'Dordogne' )
    ,( the_country_id, 'Metropolitan department', '25', 'Doubs' )
    ,( the_country_id, 'Metropolitan department', '26', 'Drôme' )
    ,( the_country_id, 'Metropolitan department', '27', 'Eure' )
    ,( the_country_id, 'Metropolitan department', '28', 'Eure-et-Loir' )
    ,( the_country_id, 'Metropolitan department', '29', 'Finistère' )
    ,( the_country_id, 'Metropolitan department', '2A', 'Corse-du-Sud' )
    ,( the_country_id, 'Metropolitan department', '2B', 'Haute-Corse' )
    ,( the_country_id, 'Metropolitan department', '30', 'Gard' )
    ,( the_country_id, 'Metropolitan department', '31', 'Haute-Garonne' )
    ,( the_country_id, 'Metropolitan department', '32', 'Gers' )
    ,( the_country_id, 'Metropolitan department', '33', 'Gironde' )
    ,( the_country_id, 'Metropolitan department', '34', 'Hérault' )
    ,( the_country_id, 'Metropolitan department', '35', 'Ille-et-Vilaine' )
    ,( the_country_id, 'Metropolitan department', '36', 'Indre' )
    ,( the_country_id, 'Metropolitan department', '37', 'Indre-et-Loire' )
    ,( the_country_id, 'Metropolitan department', '38', 'Isère' )
    ,( the_country_id, 'Metropolitan department', '39', 'Jura' )
    ,( the_country_id, 'Metropolitan department', '40', 'Landes' )
    ,( the_country_id, 'Metropolitan department', '41', 'Loir-et-Cher' )
    ,( the_country_id, 'Metropolitan department', '42', 'Loire' )
    ,( the_country_id, 'Metropolitan department', '43', 'Haute-Loire' )
    ,( the_country_id, 'Metropolitan department', '44', 'Loire-Atlantique' )
    ,( the_country_id, 'Metropolitan department', '45', 'Loiret' )
    ,( the_country_id, 'Metropolitan department', '46', 'Lot' )
    ,( the_country_id, 'Metropolitan department', '47', 'Lot-et-Garonne' )
    ,( the_country_id, 'Metropolitan department', '48', 'Lozère' )
    ,( the_country_id, 'Metropolitan department', '49', 'Maine-et-Loire' )
    ,( the_country_id, 'Metropolitan department', '50', 'Manche' )
    ,( the_country_id, 'Metropolitan department', '51', 'Marne' )
    ,( the_country_id, 'Metropolitan department', '52', 'Haute-Marne' )
    ,( the_country_id, 'Metropolitan department', '53', 'Mayenne' )
    ,( the_country_id, 'Metropolitan department', '54', 'Meurthe-et-Moselle' )
    ,( the_country_id, 'Metropolitan department', '55', 'Meuse' )
    ,( the_country_id, 'Metropolitan department', '56', 'Morbihan' )
    ,( the_country_id, 'Metropolitan department', '57', 'Moselle' )
    ,( the_country_id, 'Metropolitan department', '58', 'Nièvre' )
    ,( the_country_id, 'Metropolitan department', '59', 'Nord' )
    ,( the_country_id, 'Metropolitan department', '60', 'Oise' )
    ,( the_country_id, 'Metropolitan department', '61', 'Orne' )
    ,( the_country_id, 'Metropolitan department', '62', 'Pas-de-Calais' )
    ,( the_country_id, 'Metropolitan department', '63', 'Puy-de-Dôme' )
    ,( the_country_id, 'Metropolitan department', '64', 'Pyrénées-Atlantiques' )
    ,( the_country_id, 'Metropolitan department', '65', 'Hautes-Pyrénées' )
    ,( the_country_id, 'Metropolitan department', '66', 'Pyrénées-Orientales' )
    ,( the_country_id, 'Metropolitan department', '67', 'Bas-Rhin' )
    ,( the_country_id, 'Metropolitan department', '68', 'Haut-Rhin' )
    ,( the_country_id, 'Metropolitan department', '69', 'Rhône' )
    ,( the_country_id, 'Metropolitan department', '70', 'Haute-Saône' )
    ,( the_country_id, 'Metropolitan department', '71', 'Saône-et-Loire' )
    ,( the_country_id, 'Metropolitan department', '72', 'Sarthe' )
    ,( the_country_id, 'Metropolitan department', '73', 'Savoie' )
    ,( the_country_id, 'Metropolitan department', '74', 'Haute-Savoie' )
    ,( the_country_id, 'Metropolitan department', '75', 'Paris' )
    ,( the_country_id, 'Metropolitan department', '76', 'Seine-Maritime' )
    ,( the_country_id, 'Metropolitan department', '77', 'Seine-et-Marne' )
    ,( the_country_id, 'Metropolitan department', '78', 'Yvelines' )
    ,( the_country_id, 'Metropolitan department', '79', 'Deux-Sèvres' )
    ,( the_country_id, 'Metropolitan department', '80', 'Somme' )
    ,( the_country_id, 'Metropolitan department', '81', 'Tarn' )
    ,( the_country_id, 'Metropolitan department', '82', 'Tarn-et-Garonne' )
    ,( the_country_id, 'Metropolitan department', '83', 'Var' )
    ,( the_country_id, 'Metropolitan department', '84', 'Vaucluse' )
    ,( the_country_id, 'Metropolitan department', '85', 'Vendée' )
    ,( the_country_id, 'Metropolitan department', '86', 'Vienne' )
    ,( the_country_id, 'Metropolitan department', '87', 'Haute-Vienne' )
    ,( the_country_id, 'Metropolitan department', '88', 'Vosges' )
    ,( the_country_id, 'Metropolitan department', '89', 'Yonne' )
    ,( the_country_id, 'Metropolitan department', '90', 'Territoire de Belfort' )
    ,( the_country_id, 'Metropolitan department', '91', 'Essonne' )
    ,( the_country_id, 'Metropolitan department', '92', 'Hauts-de-Seine' )
    ,( the_country_id, 'Metropolitan department', '93', 'Seine-Saint-Denis' )
    ,( the_country_id, 'Metropolitan department', '94', 'Val-de-Marne' )
    ,( the_country_id, 'Metropolitan department', '95', 'Val-d''Oise' );
    
    -- Gabon
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'GA' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', '1', 'Estuaire' )
    ,( the_country_id, 'Province', '2', 'Haut-Ogooué' )
    ,( the_country_id, 'Province', '3', 'Moyen-Ogooué' )
    ,( the_country_id, 'Province', '4', 'Ngounié' )
    ,( the_country_id, 'Province', '5', 'Nyanga' )
    ,( the_country_id, 'Province', '6', 'Ogooué-Ivindo' )
    ,( the_country_id, 'Province', '7', 'Ogooué-Lolo' )
    ,( the_country_id, 'Province', '8', 'Ogooué-Maritime' )
    ,( the_country_id, 'Province', '9', 'Woleu-Ntem' );
    
    -- United Kingdom of Great Britain and Northern Ireland
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'GB' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Council area', 'ABD', 'Aberdeenshire' )
    ,( the_country_id, 'Council area', 'ABE', 'Aberdeen City' )
    ,( the_country_id, 'Council area', 'AGB', 'Argyll and Bute' )
    ,( the_country_id, 'Unitary authority', 'AGY', 'Isle of Anglesey [Sir Ynys Môn GB-YNM]' )
    ,( the_country_id, 'Council area', 'ANS', 'Angus' )
    ,( the_country_id, 'District council area', 'ANT', 'Antrim' )
    ,( the_country_id, 'District council area', 'ARD', 'Ards' )
    ,( the_country_id, 'District council area', 'ARM', 'Armagh' )
    ,( the_country_id, 'Unitary authority', 'BAS', 'Bath and North East Somerset' )
    ,( the_country_id, 'Unitary authority', 'BBD', 'Blackburn with Darwen' )
    ,( the_country_id, 'Council area', 'BDF', 'Bedford' )
    ,( the_country_id, 'London borough', 'BDG', 'Barking and Dagenham' )
    ,( the_country_id, 'Council area', 'BEN', 'Brent' )
    ,( the_country_id, 'Council area', 'BEX', 'Bexley' )
    ,( the_country_id, 'District council area', 'BFS', 'Belfast' )
    ,( the_country_id, 'Unitary authority', 'BGE', 'Bridgend [Pen-y-bont ar Ogwr GB-POG]' )
    ,( the_country_id, 'Unitary authority', 'BGW', 'Blaenau Gwent' )
    ,( the_country_id, 'Council area', 'BIR', 'Birmingham' )
    ,( the_country_id, 'County', 'BKM', 'Buckinghamshire' )
    ,( the_country_id, 'District council area', 'BLA', 'Ballymena' )
    ,( the_country_id, 'District council area', 'BLY', 'Ballymoney' )
    ,( the_country_id, 'Unitary authority', 'BMH', 'Bournemouth' )
    ,( the_country_id, 'District council area', 'BNB', 'Banbridge' )
    ,( the_country_id, 'Council area', 'BNE', 'Barnet' )
    ,( the_country_id, 'Unitary authority', 'BNH', 'Brighton and Hove' )
    ,( the_country_id, 'Council area', 'BNS', 'Barnsley' )
    ,( the_country_id, 'Council area', 'BOL', 'Bolton' )
    ,( the_country_id, 'Unitary authority', 'BPL', 'Blackpool' )
    ,( the_country_id, 'Unitary authority', 'BRC', 'Bracknell Forest' )
    ,( the_country_id, 'Council area', 'BRD', 'Bradford' )
    ,( the_country_id, 'Council area', 'BRY', 'Bromley' )
    ,( the_country_id, 'Unitary authority', 'BST', 'Bristol, City of' )
    ,( the_country_id, 'Council area', 'BUR', 'Bury' )
    ,( the_country_id, 'County', 'CAM', 'Cambridgeshire' )
    ,( the_country_id, 'Unitary authority', 'CAY', 'Caerphilly [Caerffili GB-CAF]' )
    ,( the_country_id, 'Unitary authority', 'CBF', 'Central Bedfordshire' )
    ,( the_country_id, 'Unitary authority', 'CGN', 'Ceredigion [Sir Ceredigion]' )
    ,( the_country_id, 'District council area', 'CGV', 'Craigavon' )
    ,( the_country_id, 'Unitary authority', 'CHE', 'Cheshire East' )
    ,( the_country_id, 'Unitary authority', 'CHW', 'Cheshire West and Chester' )
    ,( the_country_id, 'District council area', 'CKF', 'Carrickfergus' )
    ,( the_country_id, 'District council area', 'CKT', 'Cookstown' )
    ,( the_country_id, 'Council area', 'CLD', 'Calderdale' )
    ,( the_country_id, 'Council area', 'CLK', 'Clackmannanshire' )
    ,( the_country_id, 'District council area', 'CLR', 'Coleraine' )
    ,( the_country_id, 'County', 'CMA', 'Cumbria' )
    ,( the_country_id, 'Council area', 'CMD', 'Camden' )
    ,( the_country_id, 'Unitary authority', 'CMN', 'Carmarthenshire [Sir Gaerfyrddin GB-GFY]' )
    ,( the_country_id, 'Unitary authority', 'CON', 'Cornwall' )
    ,( the_country_id, 'Council area', 'COV', 'Coventry' )
    ,( the_country_id, 'Unitary authority', 'CRF', 'Cardiff [Caerdydd GB-CRD]' )
    ,( the_country_id, 'Council area', 'CRY', 'Croydon' )
    ,( the_country_id, 'District council area', 'CSR', 'Castlereagh' )
    ,( the_country_id, 'Unitary authority', 'CWY', 'Conwy' )
    ,( the_country_id, 'Unitary authority', 'DAL', 'Darlington' )
    ,( the_country_id, 'County', 'DBY', 'Derbyshire' )
    ,( the_country_id, 'Unitary authority', 'DEN', 'Denbighshire [Sir Ddinbych GB-DDB]' )
    ,( the_country_id, 'Unitary authority', 'DER', 'Derby' )
    ,( the_country_id, 'County', 'DEV', 'Devon' )
    ,( the_country_id, 'District council area', 'DGN', 'Dungannon and South Tyrone' )
    ,( the_country_id, 'Council area', 'DGY', 'Dumfries and Galloway' )
    ,( the_country_id, 'Council area', 'DNC', 'Doncaster' )
    ,( the_country_id, 'Council area', 'DND', 'Dundee City' )
    ,( the_country_id, 'County', 'DOR', 'Dorset' )
    ,( the_country_id, 'District council area', 'DOW', 'Down' )
    ,( the_country_id, 'District council area', 'DRY', 'Derry' )
    ,( the_country_id, 'Council area', 'DUD', 'Dudley' )
    ,( the_country_id, 'Unitary authority', 'DUR', 'Durham' )
    ,( the_country_id, 'Council area', 'EAL', 'Ealing' )
    ,( the_country_id, 'Council area', 'EAY', 'East Ayrshire' )
    ,( the_country_id, 'Council area', 'EDH', 'Edinburgh, City of' )
    ,( the_country_id, 'Council area', 'EDU', 'East Dunbartonshire' )
    ,( the_country_id, 'Council area', 'ELN', 'East Lothian' )
    ,( the_country_id, 'Council area', 'ELS', 'Eilean Siar' )
    ,( the_country_id, 'Council area', 'ENF', 'Enfield' )
    ,( the_country_id, 'Council area', 'ERW', 'East Renfrewshire' )
    ,( the_country_id, 'Unitary authority', 'ERY', 'East Riding of Yorkshire' )
    ,( the_country_id, 'County', 'ESS', 'Essex' )
    ,( the_country_id, 'County', 'ESX', 'East Sussex' )
    ,( the_country_id, 'Council area', 'FAL', 'Falkirk' )
    ,( the_country_id, 'District council area', 'FER', 'Fermanagh' )
    ,( the_country_id, 'Council area', 'FIF', 'Fife' )
    ,( the_country_id, 'Unitary authority', 'FLN', 'Flintshire [Sir y Fflint GB-FFL]' )
    ,( the_country_id, 'Council area', 'GAT', 'Gateshead' )
    ,( the_country_id, 'Council area', 'GLG', 'Glasgow City' )
    ,( the_country_id, 'County', 'GLS', 'Gloucestershire' )
    ,( the_country_id, 'Council area', 'GRE', 'Greenwich' )
    ,( the_country_id, 'Unitary authority', 'GWN', 'Gwynedd' )
    ,( the_country_id, 'Unitary authority', 'HAL', 'Halton' )
    ,( the_country_id, 'County', 'HAM', 'Hampshire' )
    ,( the_country_id, 'Council area', 'HAV', 'Havering' )
    ,( the_country_id, 'Council area', 'HCK', 'Hackney' )
    ,( the_country_id, 'Unitary authority', 'HEF', 'Herefordshire' )
    ,( the_country_id, 'Council area', 'HIL', 'Hillingdon' )
    ,( the_country_id, 'Council area', 'HLD', 'Highland' )
    ,( the_country_id, 'Council area', 'HMF', 'Hammersmith and Fulham' )
    ,( the_country_id, 'Council area', 'HNS', 'Hounslow' )
    ,( the_country_id, 'Unitary authority', 'HPL', 'Hartlepool' )
    ,( the_country_id, 'County', 'HRT', 'Hertfordshire' )
    ,( the_country_id, 'Council area', 'HRW', 'Harrow' )
    ,( the_country_id, 'Council area', 'HRY', 'Haringey' )
    ,( the_country_id, 'Unitary authority', 'IOS', 'Isles of Scilly' )
    ,( the_country_id, 'Unitary authority', 'IOW', 'Isle of Wight' )
    ,( the_country_id, 'Council area', 'ISL', 'Islington' )
    ,( the_country_id, 'Council area', 'IVC', 'Inverclyde' )
    ,( the_country_id, 'Council area', 'KEC', 'Kensington and Chelsea' )
    ,( the_country_id, 'County', 'KEN', 'Kent' )
    ,( the_country_id, 'Unitary authority', 'KHL', 'Kingston upon Hull' )
    ,( the_country_id, 'Council area', 'KIR', 'Kirklees' )
    ,( the_country_id, 'Council area', 'KTT', 'Kingston upon Thames' )
    ,( the_country_id, 'Council area', 'KWL', 'Knowsley' )
    ,( the_country_id, 'County', 'LAN', 'Lancashire' )
    ,( the_country_id, 'Council area', 'LBH', 'Lambeth' )
    ,( the_country_id, 'Unitary authority', 'LCE', 'Leicester' )
    ,( the_country_id, 'Council area', 'LDS', 'Leeds' )
    ,( the_country_id, 'County', 'LEC', 'Leicestershire' )
    ,( the_country_id, 'Council area', 'LEW', 'Lewisham' )
    ,( the_country_id, 'County', 'LIN', 'Lincolnshire' )
    ,( the_country_id, 'Council area', 'LIV', 'Liverpool' )
    ,( the_country_id, 'District council area', 'LMV', 'Limavady' )
    ,( the_country_id, 'City Corporation', 'LND', 'London, City of' )
    ,( the_country_id, 'District council area', 'LRN', 'Larne' )
    ,( the_country_id, 'District council area', 'LSB', 'Lisburn' )
    ,( the_country_id, 'Unitary authority', 'LUT', 'Luton' )
    ,( the_country_id, 'Council area', 'MAN', 'Manchester' )
    ,( the_country_id, 'Unitary authority', 'MDB', 'Middlesbrough' )
    ,( the_country_id, 'Unitary authority', 'MDW', 'Medway' )
    ,( the_country_id, 'District council area', 'MFT', 'Magherafelt' )
    ,( the_country_id, 'Unitary authority', 'MIK', 'Milton Keynes' )
    ,( the_country_id, 'Council area', 'MLN', 'Midlothian' )
    ,( the_country_id, 'Unitary authority', 'MON', 'Monmouthshire [Sir Fynwy GB-FYN]' )
    ,( the_country_id, 'Council area', 'MRT', 'Merton' )
    ,( the_country_id, 'Council area', 'MRY', 'Moray' )
    ,( the_country_id, 'Unitary authority', 'MTY', 'Merthyr Tydfil [Merthyr Tudful GB-MTU]' )
    ,( the_country_id, 'District council area', 'MYL', 'Moyle' )
    ,( the_country_id, 'Council area', 'NAY', 'North Ayrshire' )
    ,( the_country_id, 'Unitary authority', 'NBL', 'Northumberland' )
    ,( the_country_id, 'District council area', 'NDN', 'North Down' )
    ,( the_country_id, 'Unitary authority', 'NEL', 'North East Lincolnshire' )
    ,( the_country_id, 'Council area', 'NET', 'Newcastle upon Tyne' )
    ,( the_country_id, 'County', 'NFK', 'Norfolk' )
    ,( the_country_id, 'Unitary authority', 'NGM', 'Nottingham' )
    ,( the_country_id, 'Council area', 'NLK', 'North Lanarkshire' )
    ,( the_country_id, 'Unitary authority', 'NLN', 'North Lincolnshire' )
    ,( the_country_id, 'Unitary authority', 'NSM', 'North Somerset' )
    ,( the_country_id, 'District council area', 'NTA', 'Newtownabbey' )
    ,( the_country_id, 'County', 'NTH', 'Northamptonshire' )
    ,( the_country_id, 'Unitary authority', 'NTL', 'Neath Port Talbot [Castell-nedd Port Talbot GB-CTL]' )
    ,( the_country_id, 'County', 'NTT', 'Nottinghamshire' )
    ,( the_country_id, 'Council area', 'NTY', 'North Tyneside' )
    ,( the_country_id, 'Council area', 'NWM', 'Newham' )
    ,( the_country_id, 'Unitary authority', 'NWP', 'Newport [Casnewydd GB-CNW]' )
    ,( the_country_id, 'County', 'NYK', 'North Yorkshire' )
    ,( the_country_id, 'District council area', 'NYM', 'Newry and Mourne' )
    ,( the_country_id, 'Council area', 'OLD', 'Oldham' )
    ,( the_country_id, 'District council area', 'OMH', 'Omagh' )
    ,( the_country_id, 'Council area', 'ORK', 'Orkney Islands' )
    ,( the_country_id, 'County', 'OXF', 'Oxfordshire' )
    ,( the_country_id, 'Unitary authority', 'PEM', 'Pembrokeshire [Sir Benfro GB-BNF]' )
    ,( the_country_id, 'Council area', 'PKN', 'Perth and Kinross' )
    ,( the_country_id, 'Unitary authority', 'PLY', 'Plymouth' )
    ,( the_country_id, 'Unitary authority', 'POL', 'Poole' )
    ,( the_country_id, 'Unitary authority', 'POR', 'Portsmouth' )
    ,( the_country_id, 'Unitary authority', 'POW', 'Powys' )
    ,( the_country_id, 'Unitary authority', 'PTE', 'Peterborough' )
    ,( the_country_id, 'Unitary authority', 'RCC', 'Redcar and Cleveland' )
    ,( the_country_id, 'Council area', 'RCH', 'Rochdale' )
    ,( the_country_id, 'Unitary authority', 'RCT', 'Rhondda, Cynon, Taff [Rhondda, Cynon,Taf]' )
    ,( the_country_id, 'Council area', 'RDB', 'Redbridge' )
    ,( the_country_id, 'Unitary authority', 'RDG', 'Reading' )
    ,( the_country_id, 'Council area', 'RFW', 'Renfrewshire' )
    ,( the_country_id, 'Council area', 'RIC', 'Richmond upon Thames' )
    ,( the_country_id, 'Council area', 'ROT', 'Rotherham' )
    ,( the_country_id, 'Unitary authority', 'RUT', 'Rutland' )
    ,( the_country_id, 'Council area', 'SAW', 'Sandwell' )
    ,( the_country_id, 'Council area', 'SAY', 'South Ayrshire' )
    ,( the_country_id, 'Council area', 'SCB', 'Scottish Borders, The' )
    ,( the_country_id, 'County', 'SFK', 'Suffolk' )
    ,( the_country_id, 'Council area', 'SFT', 'Sefton' )
    ,( the_country_id, 'Unitary authority', 'SGC', 'South Gloucestershire' )
    ,( the_country_id, 'Council area', 'SHF', 'Sheffield' )
    ,( the_country_id, 'Council area', 'SHN', 'St. Helens' )
    ,( the_country_id, 'Unitary authority', 'SHR', 'Shropshire' )
    ,( the_country_id, 'Council area', 'SKP', 'Stockport' )
    ,( the_country_id, 'Council area', 'SLF', 'Salford' )
    ,( the_country_id, 'Unitary authority', 'SLG', 'Slough' )
    ,( the_country_id, 'Council area', 'SLK', 'South Lanarkshire' )
    ,( the_country_id, 'Council area', 'SND', 'Sunderland' )
    ,( the_country_id, 'Council area', 'SOL', 'Solihull' )
    ,( the_country_id, 'County', 'SOM', 'Somerset' )
    ,( the_country_id, 'Unitary authority', 'SOS', 'Southend-on-Sea' )
    ,( the_country_id, 'County', 'SRY', 'Surrey' )
    ,( the_country_id, 'District council area', 'STB', 'Strabane' )
    ,( the_country_id, 'Unitary authority', 'STE', 'Stoke-on-Trent' )
    ,( the_country_id, 'Council area', 'STG', 'Stirling' )
    ,( the_country_id, 'Unitary authority', 'STH', 'Southampton' )
    ,( the_country_id, 'Council area', 'STN', 'Sutton' )
    ,( the_country_id, 'County', 'STS', 'Staffordshire' )
    ,( the_country_id, 'Unitary authority', 'STT', 'Stockton-on-Tees' )
    ,( the_country_id, 'Council area', 'STY', 'South Tyneside' )
    ,( the_country_id, 'Unitary authority', 'SWA', 'Swansea [Abertawe GB-ATA]' )
    ,( the_country_id, 'Unitary authority', 'SWD', 'Swindon' )
    ,( the_country_id, 'Council area', 'SWK', 'Southwark' )
    ,( the_country_id, 'Council area', 'TAM', 'Tameside' )
    ,( the_country_id, 'Unitary authority', 'TFW', 'Telford and Wrekin' )
    ,( the_country_id, 'Unitary authority', 'THR', 'Thurrock' )
    ,( the_country_id, 'Unitary authority', 'TOB', 'Torbay' )
    ,( the_country_id, 'Unitary authority', 'TOF', 'Torfaen [Tor-faen]' )
    ,( the_country_id, 'Council area', 'TRF', 'Trafford' )
    ,( the_country_id, 'Council area', 'TWH', 'Tower Hamlets' )
    ,( the_country_id, 'Unitary authority', 'VGL', 'Vale of Glamorgan, The [Bro Morgannwg GB-BMG]' )
    ,( the_country_id, 'County', 'WAR', 'Warwickshire' )
    ,( the_country_id, 'Unitary authority', 'WBK', 'West Berkshire' )
    ,( the_country_id, 'Council area', 'WDU', 'West Dunbartonshire' )
    ,( the_country_id, 'Council area', 'WFT', 'Waltham Forest' )
    ,( the_country_id, 'Council area', 'WGN', 'Wigan' )
    ,( the_country_id, 'Unitary authority', 'WIL', 'Wiltshire' )
    ,( the_country_id, 'Council area', 'WKF', 'Wakefield' )
    ,( the_country_id, 'Council area', 'WLL', 'Walsall' )
    ,( the_country_id, 'Council area', 'WLN', 'West Lothian' )
    ,( the_country_id, 'Council area', 'WLV', 'Wolverhampton' )
    ,( the_country_id, 'Council area', 'WND', 'Wandsworth' )
    ,( the_country_id, 'Unitary authority', 'WNM', 'Windsor and Maidenhead' )
    ,( the_country_id, 'Unitary authority', 'WOK', 'Wokingham' )
    ,( the_country_id, 'County', 'WOR', 'Worcestershire' )
    ,( the_country_id, 'Council area', 'WRL', 'Wirral' )
    ,( the_country_id, 'Unitary authority', 'WRT', 'Warrington' )
    ,( the_country_id, 'Unitary authority', 'WRX', 'Wrexham [Wrecsam GB-WRC]' )
    ,( the_country_id, 'Council area', 'WSM', 'Westminster' )
    ,( the_country_id, 'County', 'WSX', 'West Sussex' )
    ,( the_country_id, 'Unitary authority', 'YOR', 'York' )
    ,( the_country_id, 'Council area', 'ZET', 'Shetland Islands' );
    
    -- Grenada
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'GD' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Parish', '01', 'Saint Andrew' )
    ,( the_country_id, 'Parish', '02', 'Saint David' )
    ,( the_country_id, 'Parish', '03', 'Saint George' )
    ,( the_country_id, 'Parish', '04', 'Saint John' )
    ,( the_country_id, 'Parish', '05', 'Saint Mark' )
    ,( the_country_id, 'Parish', '06', 'Saint Patrick' )
    ,( the_country_id, 'Dependency', '10', 'Southern Grenadine Islands' );
    
    -- Georgia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'GE' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Autonomous republic', 'AB', 'Abkhazia' )
    ,( the_country_id, 'Autonomous republic', 'AJ', 'Ajaria' )
    ,( the_country_id, 'Region', 'GU', 'Guria' )
    ,( the_country_id, 'Region', 'IM', 'Imeret''i' )
    ,( the_country_id, 'Region', 'KA', 'Kakhet''i' )
    ,( the_country_id, 'Region', 'KK', 'K''vemo K''art''li' )
    ,( the_country_id, 'Region', 'MM', 'Mts''khet''a-Mt''ianet''i' )
    ,( the_country_id, 'Region', 'RL', 'Racha-Lech’khumi-K’vemo Svanet’i' )
    ,( the_country_id, 'Region', 'SJ', 'Samts''khe-Javakhet''i' )
    ,( the_country_id, 'Region', 'SK', 'Shida K''art''li' )
    ,( the_country_id, 'Region', 'SZ', 'Samegrelo-Zemo Svanet''i' )
    ,( the_country_id, 'City', 'TB', 'T''bilisi' );
    
    -- Ghana
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'GH' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'AA', 'Greater Accra' )
    ,( the_country_id, 'Region', 'AH', 'Ashanti' )
    ,( the_country_id, 'Region', 'BA', 'Brong-Ahafo' )
    ,( the_country_id, 'Region', 'CP', 'Central' )
    ,( the_country_id, 'Region', 'EP', 'Eastern' )
    ,( the_country_id, 'Region', 'NP', 'Northern' )
    ,( the_country_id, 'Region', 'TV', 'Volta' )
    ,( the_country_id, 'Region', 'UE', 'Upper East' )
    ,( the_country_id, 'Region', 'UW', 'Upper West' )
    ,( the_country_id, 'Region', 'WP', 'Western' );
    
    -- Greenland
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'GL' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Municipality', 'KU', 'Kommune Kujalleq' )
    ,( the_country_id, 'Municipality', 'QA', 'Qaasuitsup Kommunia' )
    ,( the_country_id, 'Municipality', 'QE', 'Qeqqata Kommunia' )
    ,( the_country_id, 'Municipality', 'SM', 'Kommuneqarfik Sermersooq' );
    
    -- Gambia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'GM' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'City', 'B', 'Banjul' )
    ,( the_country_id, 'Division', 'L', 'Lower River' )
    ,( the_country_id, 'Division', 'M', 'Central River' )
    ,( the_country_id, 'Division', 'N', 'North Bank' )
    ,( the_country_id, 'Division', 'U', 'Upper River' )
    ,( the_country_id, 'Division', 'W', 'Western' );
    
    -- Guinea
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'GN' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Prefecture', 'BE', 'Beyla' )
    ,( the_country_id, 'Prefecture', 'BF', 'Boffa' )
    ,( the_country_id, 'Prefecture', 'BK', 'Boké' )
    ,( the_country_id, 'Prefecture', 'CO', 'Coyah' )
    ,( the_country_id, 'Prefecture', 'DB', 'Dabola' )
    ,( the_country_id, 'Prefecture', 'DI', 'Dinguiraye' )
    ,( the_country_id, 'Prefecture', 'DL', 'Dalaba' )
    ,( the_country_id, 'Prefecture', 'DU', 'Dubréka' )
    ,( the_country_id, 'Prefecture', 'FA', 'Faranah' )
    ,( the_country_id, 'Prefecture', 'FO', 'Forécariah' )
    ,( the_country_id, 'Prefecture', 'FR', 'Fria' )
    ,( the_country_id, 'Prefecture', 'GA', 'Gaoual' )
    ,( the_country_id, 'Prefecture', 'GU', 'Guékédou' )
    ,( the_country_id, 'Prefecture', 'KA', 'Kankan' )
    ,( the_country_id, 'Prefecture', 'KB', 'Koubia' )
    ,( the_country_id, 'Prefecture', 'KD', 'Kindia' )
    ,( the_country_id, 'Prefecture', 'KE', 'Kérouané' )
    ,( the_country_id, 'Prefecture', 'KN', 'Koundara' )
    ,( the_country_id, 'Prefecture', 'KO', 'Kouroussa' )
    ,( the_country_id, 'Prefecture', 'KS', 'Kissidougou' )
    ,( the_country_id, 'Prefecture', 'LA', 'Labé' )
    ,( the_country_id, 'Prefecture', 'LE', 'Lélouma' )
    ,( the_country_id, 'Prefecture', 'LO', 'Lola' )
    ,( the_country_id, 'Prefecture', 'MC', 'Macenta' )
    ,( the_country_id, 'Prefecture', 'MD', 'Mandiana' )
    ,( the_country_id, 'Prefecture', 'ML', 'Mali' )
    ,( the_country_id, 'Prefecture', 'MM', 'Mamou' )
    ,( the_country_id, 'Prefecture', 'NZ', 'Nzérékoré' )
    ,( the_country_id, 'Prefecture', 'PI', 'Pita' )
    ,( the_country_id, 'Prefecture', 'SI', 'Siguiri' )
    ,( the_country_id, 'Prefecture', 'TE', 'Télimélé' )
    ,( the_country_id, 'Prefecture', 'TO', 'Tougué' )
    ,( the_country_id, 'Prefecture', 'YO', 'Yomou' );
    
    -- Equatorial Guinea
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'GQ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'AN', 'Annobón' )
    ,( the_country_id, 'Province', 'BN', 'Bioko Norte' )
    ,( the_country_id, 'Province', 'BS', 'Bioko Sur' )
    ,( the_country_id, 'Province', 'CS', 'Centro Sur' )
    ,( the_country_id, 'Province', 'KN', 'Kié-Ntem' )
    ,( the_country_id, 'Province', 'LI', 'Litoral' )
    ,( the_country_id, 'Province', 'WN', 'Wele-Nzas' );
    
    -- Greece
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'GR' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Department', '01', 'Aitoloakarnanía' )
    ,( the_country_id, 'Department', '03', 'Voiotia' )
    ,( the_country_id, 'Department', '04', 'Evvoia' )
    ,( the_country_id, 'Department', '05', 'Evrytania' )
    ,( the_country_id, 'Department', '06', 'Fthiotida' )
    ,( the_country_id, 'Department', '07', 'Fokida' )
    ,( the_country_id, 'Department', '11', 'Argolida' )
    ,( the_country_id, 'Department', '12', 'Arkadia' )
    ,( the_country_id, 'Department', '13', 'Achaïa' )
    ,( the_country_id, 'Department', '14', 'Ileia' )
    ,( the_country_id, 'Department', '15', 'Korinthia' )
    ,( the_country_id, 'Department', '16', 'Lakonia' )
    ,( the_country_id, 'Department', '17', 'Messinia' )
    ,( the_country_id, 'Department', '21', 'Zakynthos' )
    ,( the_country_id, 'Department', '22', 'Kerkyra' )
    ,( the_country_id, 'Department', '23', 'Kefallinía' )
    ,( the_country_id, 'Department', '24', 'Lefkada' )
    ,( the_country_id, 'Department', '31', 'Arta' )
    ,( the_country_id, 'Department', '32', 'Thesprotia' )
    ,( the_country_id, 'Department', '33', 'Ioannina' )
    ,( the_country_id, 'Department', '34', 'Preveza' )
    ,( the_country_id, 'Department', '41', 'Karditsa' )
    ,( the_country_id, 'Department', '42', 'Larisa' )
    ,( the_country_id, 'Department', '43', 'Magnisia' )
    ,( the_country_id, 'Department', '44', 'Trikala' )
    ,( the_country_id, 'Department', '51', 'Grevena' )
    ,( the_country_id, 'Department', '52', 'Drama' )
    ,( the_country_id, 'Department', '53', 'Imathia' )
    ,( the_country_id, 'Department', '54', 'Thessaloniki' )
    ,( the_country_id, 'Department', '55', 'Kavala' )
    ,( the_country_id, 'Department', '56', 'Kastoria' )
    ,( the_country_id, 'Department', '57', 'Kilkis' )
    ,( the_country_id, 'Department', '58', 'Kozani' )
    ,( the_country_id, 'Department', '59', 'Pella' )
    ,( the_country_id, 'Department', '61', 'Pieria' )
    ,( the_country_id, 'Department', '62', 'Serres' )
    ,( the_country_id, 'Department', '63', 'Florina' )
    ,( the_country_id, 'Department', '64', 'Chalkidiki' )
    ,( the_country_id, 'Self-Governed part', '69', 'Ágion Óros' )
    ,( the_country_id, 'Department', '71', 'Evros' )
    ,( the_country_id, 'Department', '72', 'Xanthi' )
    ,( the_country_id, 'Department', '73', 'Rodopi' )
    ,( the_country_id, 'Department', '81', 'Dodekánisa' )
    ,( the_country_id, 'Department', '82', 'Kyklades' )
    ,( the_country_id, 'Department', '83', 'Lesvos' )
    ,( the_country_id, 'Department', '84', 'Samos' )
    ,( the_country_id, 'Department', '85', 'Chios' )
    ,( the_country_id, 'Department', '91', 'Irakleio' )
    ,( the_country_id, 'Department', '92', 'Lasithi' )
    ,( the_country_id, 'Department', '93', 'Rethýmnis' )
    ,( the_country_id, 'Department', '94', 'Chania' )
    ,( the_country_id, 'Department', 'A1', 'Attiki' );
    
    -- Guatemala
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'GT' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, ' Department', 'AV', 'Alta Verapaz' )
    ,( the_country_id, ' Department', 'BV', 'Baja Verapaz' )
    ,( the_country_id, ' Department', 'CM', 'Chimaltenango' )
    ,( the_country_id, ' Department', 'CQ', 'Chiquimula' )
    ,( the_country_id, ' Department', 'ES', 'Escuintla' )
    ,( the_country_id, ' Department', 'GU', 'Guatemala' )
    ,( the_country_id, ' Department', 'HU', 'Huehuetenango' )
    ,( the_country_id, ' Department', 'IZ', 'Izabal' )
    ,( the_country_id, ' Department', 'JA', 'Jalapa' )
    ,( the_country_id, ' Department', 'JU', 'Jutiapa' )
    ,( the_country_id, ' Department', 'PE', 'Petén' )
    ,( the_country_id, ' Department', 'PR', 'El Progreso' )
    ,( the_country_id, ' Department', 'QC', 'Quiché' )
    ,( the_country_id, ' Department', 'QZ', 'Quetzaltenango' )
    ,( the_country_id, ' Department', 'RE', 'Retalhuleu' )
    ,( the_country_id, ' Department', 'SA', 'Sacatepéquez' )
    ,( the_country_id, ' Department', 'SM', 'San Marcos' )
    ,( the_country_id, ' Department', 'SO', 'Sololá' )
    ,( the_country_id, ' Department', 'SR', 'Santa Rosa' )
    ,( the_country_id, ' Department', 'SU', 'Suchitepéquez' )
    ,( the_country_id, ' Department', 'TO', 'Totonicapán' )
    ,( the_country_id, ' Department', 'ZA', 'Zacapa' );
    
    -- Guinea-Bissau
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'GW' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'BA', 'Bafatá' )
    ,( the_country_id, 'Region', 'BL', 'Bolama' )
    ,( the_country_id, 'Region', 'BM', 'Biombo' )
    ,( the_country_id, 'Autonomous sector', 'BS', 'Bissau' )
    ,( the_country_id, 'Region', 'CA', 'Cacheu' )
    ,( the_country_id, 'Region', 'GA', 'Gabú' )
    ,( the_country_id, 'Region', 'OI', 'Oio' )
    ,( the_country_id, 'Region', 'QU', 'Quinara' )
    ,( the_country_id, 'Region', 'TO', 'Tombali ' );
    
    -- Guyana
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'GY' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'BA', 'Barima-Waini' )
    ,( the_country_id, 'Region', 'CU', 'Cuyuni-Mazaruni' )
    ,( the_country_id, 'Region', 'DE', 'Demerara-Mahaica' )
    ,( the_country_id, 'Region', 'EB', 'East Berbice-Corentyne' )
    ,( the_country_id, 'Region', 'ES', 'Essequibo Islands-West Demerara' )
    ,( the_country_id, 'Region', 'MA', 'Mahaica-Berbice' )
    ,( the_country_id, 'Region', 'PM', 'Pomeroon-Supenaam' )
    ,( the_country_id, 'Region', 'PT', 'Potaro-Siparuni' )
    ,( the_country_id, 'Region', 'UD', 'Upper Demerara-Berbice' )
    ,( the_country_id, 'Region', 'UT', 'Upper Takutu-Upper Essequibo' );
    
    -- Honduras
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'HN' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Department', 'AT', 'Atlántida' )
    ,( the_country_id, 'Department', 'CH', 'Choluteca' )
    ,( the_country_id, 'Department', 'CL', 'Colón' )
    ,( the_country_id, 'Department', 'CM', 'Comayagua' )
    ,( the_country_id, 'Department', 'CP', 'Copán' )
    ,( the_country_id, 'Department', 'CR', 'Cortés' )
    ,( the_country_id, 'Department', 'EP', 'El Paraíso' )
    ,( the_country_id, 'Department', 'FM', 'Francisco Morazán' )
    ,( the_country_id, 'Department', 'GD', 'Gracias a Dios' )
    ,( the_country_id, 'Department', 'IB', 'Islas de la Bahía' )
    ,( the_country_id, 'Department', 'IN', 'Intibucá' )
    ,( the_country_id, 'Department', 'LE', 'Lempira' )
    ,( the_country_id, 'Department', 'LP', 'La Paz' )
    ,( the_country_id, 'Department', 'OC', 'Ocotepeque' )
    ,( the_country_id, 'Department', 'OL', 'Olancho' )
    ,( the_country_id, 'Department', 'SB', 'Santa Bárbara' )
    ,( the_country_id, 'Department', 'VA', 'Valle' )
    ,( the_country_id, 'Department', 'YO', 'Yoro' );
    
    -- Croatia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'HR' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'County', '01', 'Zagrebacka županija' )
    ,( the_country_id, 'County', '02', 'Krapinsko-zagorska županija' )
    ,( the_country_id, 'County', '03', 'Sisacko-moslavacka županija' )
    ,( the_country_id, 'County', '04', 'Karlovacka županija' )
    ,( the_country_id, 'County', '05', 'Varaždinska županija' )
    ,( the_country_id, 'County', '06', 'Koprivnicko-križevacka županija' )
    ,( the_country_id, 'County', '07', 'Bjelovarsko-bilogorska županija' )
    ,( the_country_id, 'County', '08', 'Primorsko-goranska županija' )
    ,( the_country_id, 'County', '09', 'Licko-senjska županija' )
    ,( the_country_id, 'County', '10', 'Viroviticko-podravska županija' )
    ,( the_country_id, 'County', '11', 'Požeško-slavonska županija' )
    ,( the_country_id, 'County', '12', 'Brodsko-posavska županija' )
    ,( the_country_id, 'County', '13', 'Zadarska županija' )
    ,( the_country_id, 'County', '14', 'Osjecko-baranjska županija' )
    ,( the_country_id, 'County', '15', 'Šibensko-kninska županija' )
    ,( the_country_id, 'County', '16', 'Vukovarsko-srijemska županija' )
    ,( the_country_id, 'County', '17', 'Splitsko-dalmatinska županija' )
    ,( the_country_id, 'County', '18', 'Istarska županija' )
    ,( the_country_id, 'County', '19', 'Dubrovacko-neretvanska županija' )
    ,( the_country_id, 'County', '20', 'Medimurska županija' )
    ,( the_country_id, 'City', '21', 'Grad Zagreb' );
    
    -- Haiti
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'HT' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Department', 'AR', 'Artibonite' )
    ,( the_country_id, 'Department', 'CE', 'Centre' )
    ,( the_country_id, 'Department', 'GA', 'Grande-Anse' )
    ,( the_country_id, 'Department', 'ND', 'Nord' )
    ,( the_country_id, 'Department', 'NE', 'Nord-Est' )
    ,( the_country_id, 'Department', 'NI', 'Nippes' )
    ,( the_country_id, 'Department', 'NO', 'Nord-Ouest' )
    ,( the_country_id, 'Department', 'OU', 'Ouest' )
    ,( the_country_id, 'Department', 'SD', 'Sud' )
    ,( the_country_id, 'Department', 'SE', 'Sud-Est' );
    
    -- Hungary
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'HU' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'County', 'BA', 'Baranya' )
    ,( the_country_id, 'City of county right', 'BC', 'Békéscsaba' )
    ,( the_country_id, 'County', 'BE', 'Békés' )
    ,( the_country_id, 'County', 'BK', 'Bács-Kiskun' )
    ,( the_country_id, 'Capital City', 'BU', 'Budapest' )
    ,( the_country_id, 'County', 'BZ', 'Borsod-Abaúj-Zemplén' )
    ,( the_country_id, 'County', 'CS', 'Csongrád' )
    ,( the_country_id, 'City of county right', 'DE', 'Debrecen' )
    ,( the_country_id, 'City of county right', 'DU', 'Dunaújváros' )
    ,( the_country_id, 'City of county right', 'EG', 'Eger' )
    ,( the_country_id, 'City of county right', 'ER', 'Érd' )
    ,( the_country_id, 'County', 'FE', 'Fejér' )
    ,( the_country_id, 'County', 'GS', 'Gyor-Moson-Sopron' )
    ,( the_country_id, 'City of county right', 'GY', 'Gyor' )
    ,( the_country_id, 'County', 'HB', 'Hajdú-Bihar' )
    ,( the_country_id, 'County', 'HE', 'Heves' )
    ,( the_country_id, 'City of county right', 'HV', 'Hódmezovásárhely' )
    ,( the_country_id, 'County', 'JN', 'Jász-Nagykun-Szolnok' )
    ,( the_country_id, 'County', 'KE', 'Komárom-Esztergom' )
    ,( the_country_id, 'City of county right', 'KM', 'Kecskemét' )
    ,( the_country_id, 'City of county right', 'KV', 'Kaposvár' )
    ,( the_country_id, 'City of county right', 'MI', 'Miskolc' )
    ,( the_country_id, 'City of county right', 'NK', 'Nagykanizsa' )
    ,( the_country_id, 'County', 'NO', 'Nógrád' )
    ,( the_country_id, 'City of county right', 'NY', 'Nyíregyháza' )
    ,( the_country_id, 'County', 'PE', 'Pest' )
    ,( the_country_id, 'City of county right', 'PS', 'Pécs' )
    ,( the_country_id, 'City of county right', 'SD', 'Szeged' )
    ,( the_country_id, 'City of county right', 'SF', 'Székesfehérvár' )
    ,( the_country_id, 'City of county right', 'SH', 'Szombathely' )
    ,( the_country_id, 'City of county right', 'SK', 'Szolnok' )
    ,( the_country_id, 'City of county right', 'SN', 'Sopron' )
    ,( the_country_id, 'County', 'SO', 'Somogy' )
    ,( the_country_id, 'City of county right', 'SS', 'Szekszárd' )
    ,( the_country_id, 'City of county right', 'ST', 'Salgótarján' )
    ,( the_country_id, 'County', 'SZ', 'Szabolcs-Szatmár-Bereg' )
    ,( the_country_id, 'City of county right', 'TB', 'Tatabánya' )
    ,( the_country_id, 'County', 'TO', 'Tolna' )
    ,( the_country_id, 'County', 'VA', 'Vas' )
    ,( the_country_id, 'County', 'VE', 'Veszprém' )
    ,( the_country_id, 'City of county right', 'VM', 'Veszprém' )
    ,( the_country_id, 'County', 'ZA', 'Zala' )
    ,( the_country_id, 'City of county right', 'ZE', 'Zalaegerszeg' );
    
    -- Indonesia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'ID' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Autononous province', 'AC', 'Aceh' )
    ,( the_country_id, 'Province', 'BA', 'Bali' )
    ,( the_country_id, 'Province', 'BB', 'Bangka Belitung' )
    ,( the_country_id, 'Province', 'BE', 'Bengkulu' )
    ,( the_country_id, 'Province', 'BT', 'Banten' )
    ,( the_country_id, 'Province', 'GO', 'Gorontalo' )
    ,( the_country_id, 'Province', 'JA', 'Jambi' )
    ,( the_country_id, 'Province', 'JB', 'Jawa Barat' )
    ,( the_country_id, 'Province', 'JI', 'Jawa Timur' )
    ,( the_country_id, 'Special district', 'JK', 'Jakarta Raya' )
    ,( the_country_id, 'Province', 'JT', 'Jawa Tengah' )
    ,( the_country_id, 'Province', 'KB', 'Kalimantan Barat' )
    ,( the_country_id, 'Province', 'KI', 'Kalimantan Timur' )
    ,( the_country_id, 'Province', 'KR', 'Kepulauan Riau' )
    ,( the_country_id, 'Province', 'KS', 'Kalimantan Selatan' )
    ,( the_country_id, 'Province', 'KT', 'Kalimantan Tengah' )
    ,( the_country_id, 'Province', 'KU', 'Kalimantan Utara' )
    ,( the_country_id, 'Province', 'LA', 'Lampung' )
    ,( the_country_id, 'Province', 'MA', 'Maluku' )
    ,( the_country_id, 'Province', 'MU', 'Maluku Utara' )
    ,( the_country_id, 'Province', 'NB', 'Nusa Tenggara Barat' )
    ,( the_country_id, 'Province', 'NT', 'Nusa Tenggara Timur' )
    ,( the_country_id, 'Province', 'PA', 'Papua' )
    ,( the_country_id, 'Province', 'PB', 'Papua Barat' )
    ,( the_country_id, 'Province', 'RI', 'Riau' )
    ,( the_country_id, 'Province', 'SA', 'Sulawesi Utara' )
    ,( the_country_id, 'Province', 'SB', 'Sumatera Barat' )
    ,( the_country_id, 'Province', 'SG', 'Sulawesi Tenggara' )
    ,( the_country_id, 'Province', 'SN', 'Sulawesi Selatan' )
    ,( the_country_id, 'Province', 'SR', 'Sulawesi Barat' )
    ,( the_country_id, 'Province', 'SS', 'Sumatera Selatan' )
    ,( the_country_id, 'Province', 'ST', 'Sulawesi Tengah' )
    ,( the_country_id, 'Province', 'SU', 'Sumatera Utara' )
    ,( the_country_id, 'Special region', 'YO', 'Yogyakarta' );
    
    -- Ireland
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'IE' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'County', 'CE', 'Clare' )
    ,( the_country_id, 'County', 'CN', 'Cavan' )
    ,( the_country_id, 'County', 'CO', 'Cork' )
    ,( the_country_id, 'County', 'CW', 'Carlow' )
    ,( the_country_id, 'County', 'D', 'Dublin' )
    ,( the_country_id, 'County', 'DL', 'Donegal' )
    ,( the_country_id, 'County', 'G', 'Galway' )
    ,( the_country_id, 'County', 'KE', 'Kildare' )
    ,( the_country_id, 'County', 'KK', 'Kilkenny' )
    ,( the_country_id, 'County', 'KY', 'Kerry' )
    ,( the_country_id, 'County', 'LD', 'Longford' )
    ,( the_country_id, 'County', 'LH', 'Louth' )
    ,( the_country_id, 'County', 'LK', 'Limerick' )
    ,( the_country_id, 'County', 'LM', 'Leitrim' )
    ,( the_country_id, 'County', 'LS', 'Laois' )
    ,( the_country_id, 'County', 'MH', 'Meath' )
    ,( the_country_id, 'County', 'MN', 'Monaghan' )
    ,( the_country_id, 'County', 'MO', 'Mayo' )
    ,( the_country_id, 'County', 'OY', 'Offaly' )
    ,( the_country_id, 'County', 'RN', 'Roscommon' )
    ,( the_country_id, 'County', 'SO', 'Sligo' )
    ,( the_country_id, 'County', 'TA', 'Tipperary' )
    ,( the_country_id, 'County', 'WD', 'Waterford' )
    ,( the_country_id, 'County', 'WH', 'Westmeath' )
    ,( the_country_id, 'County', 'WW', 'Wicklow' )
    ,( the_country_id, 'County', 'WX', 'Wexford' );
    
    -- Israel
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'IL' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', 'D', 'HaDarom' )
    ,( the_country_id, 'District', 'HA', ' H_efa' )
    ,( the_country_id, 'District', 'JM', 'Yerushalayim' )
    ,( the_country_id, 'District', 'M', 'HaMerkaz' )
    ,( the_country_id, 'District', 'TA', 'Tel-Aviv' )
    ,( the_country_id, 'District', 'Z', 'HaTsafon' );
    
    -- India
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'IN' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Union territory', 'AN', 'Andaman and Nicobar Islands' )
    ,( the_country_id, 'State', 'AP', 'Andhra Pradesh' )
    ,( the_country_id, 'State', 'AR', 'Arunachal Pradesh' )
    ,( the_country_id, 'State', 'AS', 'Assam' )
    ,( the_country_id, 'State', 'BR', 'Bihar' )
    ,( the_country_id, 'Union territory', 'CH', 'Chandigarh' )
    ,( the_country_id, 'State', 'CT', 'Chhattisgarh' )
    ,( the_country_id, 'Union territory', 'DD', 'Daman and Diu' )
    ,( the_country_id, 'Union territory', 'DL', 'Delhi' )
    ,( the_country_id, 'Union territory', 'DN', 'Dadra and Nagar Haveli' )
    ,( the_country_id, 'State', 'GA', 'Goa' )
    ,( the_country_id, 'State', 'GJ', 'Gujarat' )
    ,( the_country_id, 'State', 'HP', 'Himachal Pradesh' )
    ,( the_country_id, 'State', 'HR', 'Haryana' )
    ,( the_country_id, 'State', 'JH', 'Jharkhand' )
    ,( the_country_id, 'State', 'JK', 'Jammu and Kashmir' )
    ,( the_country_id, 'State', 'KA', 'Karnataka' )
    ,( the_country_id, 'State', 'KL', 'Kerala' )
    ,( the_country_id, 'Union territory', 'LD', 'Lakshadweep' )
    ,( the_country_id, 'State', 'MH', 'Maharashtra' )
    ,( the_country_id, 'State', 'ML', 'Meghalaya' )
    ,( the_country_id, 'State', 'MN', 'Manipur' )
    ,( the_country_id, 'State', 'MP', 'Madhya Pradesh' )
    ,( the_country_id, 'State', 'MZ', 'Mizoram' )
    ,( the_country_id, 'State', 'NL', 'Nagaland' )
    ,( the_country_id, 'State', 'OR', 'Odisha' )
    ,( the_country_id, 'State', 'PB', 'Punjab' )
    ,( the_country_id, 'Union territory', 'PY', 'Puducherry' )
    ,( the_country_id, 'State', 'RJ', 'Rajasthan' )
    ,( the_country_id, 'State', 'SK', 'Sikkim' )
    ,( the_country_id, 'State', 'TG', 'Telangana' )
    ,( the_country_id, 'State', 'TN', 'Tamil Nadu' )
    ,( the_country_id, 'State', 'TR', 'Tripura' )
    ,( the_country_id, 'State', 'UP', 'Uttar Pradesh' )
    ,( the_country_id, 'State', 'UT', 'Uttarakhand' )
    ,( the_country_id, 'State', 'WB', 'West Bengal' );
    
    -- Iraq
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'IQ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Governorate', 'AN', 'AI Anbar' )
    ,( the_country_id, 'Governorate', 'AR', 'Arbil' )
    ,( the_country_id, 'Governorate', 'BA', 'Al Basrah' )
    ,( the_country_id, 'Governorate', 'BB', 'Babil' )
    ,( the_country_id, 'Governorate', 'BG', 'Baghdad' )
    ,( the_country_id, 'Governorate', 'DA', 'Dahuk' )
    ,( the_country_id, 'Governorate', 'DI', 'Diyalá' )
    ,( the_country_id, 'Governorate', 'DQ', 'Dhi Qar' )
    ,( the_country_id, 'Governorate', 'KA', 'Karbala''' )
    ,( the_country_id, 'Governorate', 'KI', 'Kirkuk' )
    ,( the_country_id, 'Governorate', 'MA', 'Maysan' )
    ,( the_country_id, 'Governorate', 'MU', 'AI Muthanná' )
    ,( the_country_id, 'Governorate', 'NA', 'An Najaf' )
    ,( the_country_id, 'Governorate', 'NI', 'Ninawá' )
    ,( the_country_id, 'Governorate', 'QA', 'Al Qadisiyah' )
    ,( the_country_id, 'Governorate', 'SD', 'Salah ad Din' )
    ,( the_country_id, 'Governorate', 'SU', 'As Sulaymaniyah' )
    ,( the_country_id, 'Governorate', 'WA', 'Wasit' );
    
    -- Iran (Islamic Republic of)
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'IR' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', '01', 'AZarbayjan-e Sharqi' )
    ,( the_country_id, 'Province', '02', 'AZarbayjan-e Gharbi' )
    ,( the_country_id, 'Province', '03', 'Ardabil' )
    ,( the_country_id, 'Province', '04', 'Esfahan' )
    ,( the_country_id, 'Province', '05', 'Ilam' )
    ,( the_country_id, 'Province', '06', 'Bushehr' )
    ,( the_country_id, 'Province', '07', 'Tehran' )
    ,( the_country_id, 'Province', '08', 'Chahar Mahall va Bakhtiari' )
    ,( the_country_id, 'Province', '10', 'Khuzestan' )
    ,( the_country_id, 'Province', '11', 'Zanjan' )
    ,( the_country_id, 'Province', '12', 'Semnan' )
    ,( the_country_id, 'Province', '13', 'Sistan va Baluchestan' )
    ,( the_country_id, 'Province', '14', 'Fars' )
    ,( the_country_id, 'Province', '15', 'Kerman' )
    ,( the_country_id, 'Province', '16', 'Kordestan' )
    ,( the_country_id, 'Province', '17', 'Kermanshah' )
    ,( the_country_id, 'Province', '18', 'Kohkiluyeh va Buyer Ahmad' )
    ,( the_country_id, 'Province', '19', 'Gilan' )
    ,( the_country_id, 'Province', '20', 'Lorestan' )
    ,( the_country_id, 'Province', '21', 'Mazandaran' )
    ,( the_country_id, 'Province', '22', 'Markazi' )
    ,( the_country_id, 'Province', '23', 'Hormozgan' )
    ,( the_country_id, 'Province', '24', 'Hamadan' )
    ,( the_country_id, 'Province', '25', 'Yazd' )
    ,( the_country_id, 'Province', '26', 'Qom' )
    ,( the_country_id, 'Province', '27', 'Golestan' )
    ,( the_country_id, 'Province', '28', 'Qazvin' )
    ,( the_country_id, 'Province', '29', 'Khorasan-e Janubi' )
    ,( the_country_id, 'Province', '30', 'Khorasan-e Razavi' )
    ,( the_country_id, 'Province', '31', 'Khorasan-e Shemali' )
    ,( the_country_id, 'Province', '32', 'Alborz' );
    
    -- Iceland
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'IS' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', '0', 'Reykjavík' )
    ,( the_country_id, 'Region', '1', 'Höfuðborgarsvæði utan Reykjavíkur' )
    ,( the_country_id, 'Region', '2', 'Suðurnes' )
    ,( the_country_id, 'Region', '3', 'Vesturland' )
    ,( the_country_id, 'Region', '4', 'Vestfirðir' )
    ,( the_country_id, 'Region', '5', 'Norðurland vestra' )
    ,( the_country_id, 'Region', '6', 'Norðurland eystra' )
    ,( the_country_id, 'Region', '7', 'Austurland' )
    ,( the_country_id, 'Region', '8', 'Suðurland' );
    
    -- Italy
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'IT' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'AG', 'Agrigento' )
    ,( the_country_id, 'Province', 'AL', 'Alessandria' )
    ,( the_country_id, 'Province', 'AN', 'Ancona' )
    ,( the_country_id, 'Province', 'AO', 'Aosta / Aoste' )
    ,( the_country_id, 'Province', 'AP', 'Ascoli Piceno' )
    ,( the_country_id, 'Province', 'AQ', 'L''Aquila' )
    ,( the_country_id, 'Province', 'AR', 'Arezzo' )
    ,( the_country_id, 'Province', 'AT', 'Asti' )
    ,( the_country_id, 'Province', 'AV', 'Avellino' )
    ,( the_country_id, 'Province', 'BA', 'Bari' )
    ,( the_country_id, 'Province', 'BG', 'Bergamo' )
    ,( the_country_id, 'Province', 'BI', 'Biella' )
    ,( the_country_id, 'Province', 'BL', 'Belluno' )
    ,( the_country_id, 'Province', 'BN', 'Benevento' )
    ,( the_country_id, 'Province', 'BO', 'Bologna' )
    ,( the_country_id, 'Province', 'BR', 'Brindisi' )
    ,( the_country_id, 'Province', 'BS', 'Brescia' )
    ,( the_country_id, 'Province', 'BT', 'Barletta-Andria-Trani' )
    ,( the_country_id, 'Province', 'BZ', 'Bolzano / Bozen' )
    ,( the_country_id, 'Province', 'CA', 'Cagliari' )
    ,( the_country_id, 'Province', 'CB', 'Campobasso' )
    ,( the_country_id, 'Province', 'CE', 'Caserta' )
    ,( the_country_id, 'Province', 'CH', 'Chieti' )
    ,( the_country_id, 'Province', 'CI', 'Carbonia-Iglesias' )
    ,( the_country_id, 'Province', 'CL', 'Caltanissetta' )
    ,( the_country_id, 'Province', 'CN', 'Cuneo' )
    ,( the_country_id, 'Province', 'CO', 'Como' )
    ,( the_country_id, 'Province', 'CR', 'Cremona' )
    ,( the_country_id, 'Province', 'CS', 'Cosenza' )
    ,( the_country_id, 'Province', 'CT', 'Catania' )
    ,( the_country_id, 'Province', 'CZ', 'Catanzaro' )
    ,( the_country_id, 'Province', 'EN', 'Enna' )
    ,( the_country_id, 'Province', 'FC', 'Forlì-Cesena' )
    ,( the_country_id, 'Province', 'FE', 'Ferrara' )
    ,( the_country_id, 'Province', 'FG', 'Foggia' )
    ,( the_country_id, 'Province', 'FI', 'Firenze' )
    ,( the_country_id, 'Province', 'FM', 'Fermo' )
    ,( the_country_id, 'Province', 'FR', 'Frosinone' )
    ,( the_country_id, 'Province', 'GE', 'Genova' )
    ,( the_country_id, 'Province', 'GO', 'Gorizia' )
    ,( the_country_id, 'Province', 'GR', 'Grosseto' )
    ,( the_country_id, 'Province', 'IM', 'Imperia' )
    ,( the_country_id, 'Province', 'IS', 'Isernia' )
    ,( the_country_id, 'Province', 'KR', 'Crotone' )
    ,( the_country_id, 'Province', 'LC', 'Lecco' )
    ,( the_country_id, 'Province', 'LE', 'Lecce' )
    ,( the_country_id, 'Province', 'LI', 'Livorno' )
    ,( the_country_id, 'Province', 'LO', 'Lodi' )
    ,( the_country_id, 'Province', 'LT', 'Latina' )
    ,( the_country_id, 'Province', 'LU', 'Lucca' )
    ,( the_country_id, 'Province', 'MB', 'Monza e Brianza' )
    ,( the_country_id, 'Province', 'MC', 'Macerata' )
    ,( the_country_id, 'Province', 'ME', 'Messina' )
    ,( the_country_id, 'Province', 'MI', 'Milano' )
    ,( the_country_id, 'Province', 'MN', 'Mantova' )
    ,( the_country_id, 'Province', 'MO', 'Modena' )
    ,( the_country_id, 'Province', 'MS', 'Massa-Carrara' )
    ,( the_country_id, 'Province', 'MT', 'Matera' )
    ,( the_country_id, 'Province', 'NA', 'Napoli' )
    ,( the_country_id, 'Province', 'NO', 'Novara' )
    ,( the_country_id, 'Province', 'NU', 'Nuoro' )
    ,( the_country_id, 'Province', 'OG', 'Ogliastra' )
    ,( the_country_id, 'Province', 'OR', 'Oristano' )
    ,( the_country_id, 'Province', 'OT', 'Olbia-Tempio' )
    ,( the_country_id, 'Province', 'PA', 'Palermo' )
    ,( the_country_id, 'Province', 'PC', 'Piacenza' )
    ,( the_country_id, 'Province', 'PD', 'Padova' )
    ,( the_country_id, 'Province', 'PE', 'Pescara' )
    ,( the_country_id, 'Province', 'PG', 'Perugia' )
    ,( the_country_id, 'Province', 'PI', 'Pisa' )
    ,( the_country_id, 'Province', 'PN', 'Pordenone' )
    ,( the_country_id, 'Province', 'PO', 'Prato' )
    ,( the_country_id, 'Province', 'PR', 'Parma' )
    ,( the_country_id, 'Province', 'PT', 'Pistoia' )
    ,( the_country_id, 'Province', 'PU', 'Pesaro e Urbino' )
    ,( the_country_id, 'Province', 'PV', 'Pavia' )
    ,( the_country_id, 'Province', 'PZ', 'Potenza' )
    ,( the_country_id, 'Province', 'RA', 'Ravenna' )
    ,( the_country_id, 'Province', 'RC', 'Reggio Calabria' )
    ,( the_country_id, 'Province', 'RE', 'Reggio Emilia' )
    ,( the_country_id, 'Province', 'RG', 'Ragusa' )
    ,( the_country_id, 'Province', 'RI', 'Rieti' )
    ,( the_country_id, 'Province', 'RM', 'Roma' )
    ,( the_country_id, 'Province', 'RN', 'Rimini' )
    ,( the_country_id, 'Province', 'RO', 'Rovigo' )
    ,( the_country_id, 'Province', 'SA', 'Salerno' )
    ,( the_country_id, 'Province', 'SI', 'Siena' )
    ,( the_country_id, 'Province', 'SO', 'Sondrio' )
    ,( the_country_id, 'Province', 'SP', 'La Spezia' )
    ,( the_country_id, 'Province', 'SR', 'Siracusa' )
    ,( the_country_id, 'Province', 'SS', 'Sassari' )
    ,( the_country_id, 'Province', 'SV', 'Savona' )
    ,( the_country_id, 'Province', 'TA', 'Taranto' )
    ,( the_country_id, 'Province', 'TE', 'Teramo' )
    ,( the_country_id, 'Province', 'TN', 'Trento' )
    ,( the_country_id, 'Province', 'TO', 'Torino' )
    ,( the_country_id, 'Province', 'TP', 'Trapani' )
    ,( the_country_id, 'Province', 'TR', 'Terni' )
    ,( the_country_id, 'Province', 'TS', 'Trieste' )
    ,( the_country_id, 'Province', 'TV', 'Treviso' )
    ,( the_country_id, 'Province', 'UD', 'Udine' )
    ,( the_country_id, 'Province', 'VA', 'Varese' )
    ,( the_country_id, 'Province', 'VB', 'Verbano-Cusio-Ossola' )
    ,( the_country_id, 'Province', 'VC', 'Vercelli' )
    ,( the_country_id, 'Province', 'VE', 'Venezia' )
    ,( the_country_id, 'Province', 'VI', 'Vicenza' )
    ,( the_country_id, 'Province', 'VR', 'Verona' )
    ,( the_country_id, 'Province', 'VS', 'Medio Campidano' )
    ,( the_country_id, 'Province', 'VT', 'Viterbo' )
    ,( the_country_id, 'Province', 'VV', 'Vibo Valentia' );
    
    -- Jamaica
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'JM' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Partish', '01', 'Kingston' )
    ,( the_country_id, 'Partish', '02', 'Saint Andrew' )
    ,( the_country_id, 'Partish', '03', 'Saint Thomas' )
    ,( the_country_id, 'Partish', '04', 'Portland' )
    ,( the_country_id, 'Partish', '05', 'Saint Mary' )
    ,( the_country_id, 'Partish', '06', 'Saint Ann' )
    ,( the_country_id, 'Partish', '07', 'Trelawny' )
    ,( the_country_id, 'Partish', '08', 'Saint James' )
    ,( the_country_id, 'Partish', '09', 'Hanover' )
    ,( the_country_id, 'Partish', '10', 'Westmoreland' )
    ,( the_country_id, 'Partish', '11', 'Saint Elizabeth' )
    ,( the_country_id, 'Partish', '12', 'Manchester' )
    ,( the_country_id, 'Partish', '13', 'Clarendon' )
    ,( the_country_id, 'Partish', '14', 'Saint Catherine' );
    
    -- Jordan
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'JO' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Governorate', 'AJ', '‘Ajlūn' )
    ,( the_country_id, 'Governorate', 'AM', 'Al ‘A̅şimah' )
    ,( the_country_id, 'Governorate', 'AQ', 'Al''Aqaba' )
    ,( the_country_id, 'Governorate', 'AT', 'At Tafilah' )
    ,( the_country_id, 'Governorate', 'AZ', 'Az Zarqā’' )
    ,( the_country_id, 'Governorate', 'BA', 'Al Balqā’' )
    ,( the_country_id, 'Governorate', 'IR', 'Irbid' )
    ,( the_country_id, 'Governorate', 'JA', 'Jarash' )
    ,( the_country_id, 'Governorate', 'KA', 'AI Karak' )
    ,( the_country_id, 'Governorate', 'MA', 'AI Mafraq' )
    ,( the_country_id, 'Governorate', 'MD', 'Madaba' )
    ,( the_country_id, 'Governorate', 'MN', 'Ma‘ān' );
    
    -- Japan
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'JP' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Prefecture', '01', 'Hokkaidô [Hokkaido]' )
    ,( the_country_id, 'Prefecture', '02', 'Aomori' )
    ,( the_country_id, 'Prefecture', '03', 'Iwate' )
    ,( the_country_id, 'Prefecture', '04', 'Miyagi' )
    ,( the_country_id, 'Prefecture', '05', 'Akita' )
    ,( the_country_id, 'Prefecture', '06', 'Yamagata' )
    ,( the_country_id, 'Prefecture', '07', 'Hukusima [Fukushima]' )
    ,( the_country_id, 'Prefecture', '08', 'Ibaraki' )
    ,( the_country_id, 'Prefecture', '09', 'Totigi [Tochigi]' )
    ,( the_country_id, 'Prefecture', '10', 'Gunma' )
    ,( the_country_id, 'Prefecture', '11', 'Saitama' )
    ,( the_country_id, 'Prefecture', '12', 'Tiba [Chiba]' )
    ,( the_country_id, 'Prefecture', '13', 'Tôkyô [Tokyo]' )
    ,( the_country_id, 'Prefecture', '14', 'Kanagawa' )
    ,( the_country_id, 'Prefecture', '15', 'Niigata' )
    ,( the_country_id, 'Prefecture', '16', 'Toyama' )
    ,( the_country_id, 'Prefecture', '17', 'Isikawa [Ishikawa]' )
    ,( the_country_id, 'Prefecture', '18', 'Hukui [Fukui]' )
    ,( the_country_id, 'Prefecture', '19', 'Yamanasi [Yamanashi]' )
    ,( the_country_id, 'Prefecture', '20', 'Nagano' )
    ,( the_country_id, 'Prefecture', '21', 'Gihu [Gifu]' )
    ,( the_country_id, 'Prefecture', '22', 'Sizuoka [Shizuoka]' )
    ,( the_country_id, 'Prefecture', '23', 'Aiti [Aichi]' )
    ,( the_country_id, 'Prefecture', '24', 'Mie' )
    ,( the_country_id, 'Prefecture', '25', 'Siga [Shiga]' )
    ,( the_country_id, 'Prefecture', '26', 'Hyôgo [Kyoto]' )
    ,( the_country_id, 'Prefecture', '27', 'Ôsaka [Osaka]' )
    ,( the_country_id, 'Prefecture', '28', 'Hyôgo[Hyogo]' )
    ,( the_country_id, 'Prefecture', '29', 'Nara' )
    ,( the_country_id, 'Prefecture', '30', 'Wakayama' )
    ,( the_country_id, 'Prefecture', '31', 'Tottori' )
    ,( the_country_id, 'Prefecture', '32', 'Simane [Shimane]' )
    ,( the_country_id, 'Prefecture', '33', 'Okayama' )
    ,( the_country_id, 'Prefecture', '34', 'Hirosima [Hiroshima]' )
    ,( the_country_id, 'Prefecture', '35', 'Yamaguti [Yamaguchi]' )
    ,( the_country_id, 'Prefecture', '36', 'Tokusima [Tokushima]' )
    ,( the_country_id, 'Prefecture', '37', 'Kagawa' )
    ,( the_country_id, 'Prefecture', '38', 'Ehime' )
    ,( the_country_id, 'Prefecture', '39', 'Kôti [Kochi]' )
    ,( the_country_id, 'Prefecture', '40', 'Hukuoka [Fukuoka]' )
    ,( the_country_id, 'Prefecture', '41', 'Saga' )
    ,( the_country_id, 'Prefecture', '42', 'Nagasaki' )
    ,( the_country_id, 'Prefecture', '43', 'Kumamoto' )
    ,( the_country_id, 'Prefecture', '44', 'Ôita [Oita]' )
    ,( the_country_id, 'Prefecture', '45', 'Miyazaki' )
    ,( the_country_id, 'Prefecture', '46', 'Kagosima [Kagoshima]' )
    ,( the_country_id, 'Prefecture', '47', 'Okinawa' );
    
    -- Kenya
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'KE' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'County', '01', 'Baringo' )
    ,( the_country_id, 'County', '02', 'Bomet' )
    ,( the_country_id, 'County', '03', 'Bungoma' )
    ,( the_country_id, 'County', '04', 'Busia' )
    ,( the_country_id, 'County', '05', 'Elgeyo/Marakwet' )
    ,( the_country_id, 'County', '06', 'Embu' )
    ,( the_country_id, 'County', '07', 'Garissa' )
    ,( the_country_id, 'County', '08', 'Homa Bay' )
    ,( the_country_id, 'County', '09', 'Isiolo' )
    ,( the_country_id, 'County', '10', 'Kajiado' )
    ,( the_country_id, 'County', '11', 'Kakamega' )
    ,( the_country_id, 'County', '12', 'Kericho' )
    ,( the_country_id, 'County', '13', 'Kiambu' )
    ,( the_country_id, 'County', '14', 'Kilifi' )
    ,( the_country_id, 'County', '15', 'Kirinyaga' )
    ,( the_country_id, 'County', '16', 'Kisii' )
    ,( the_country_id, 'County', '17', 'Kisumu' )
    ,( the_country_id, 'County', '18', 'Kitui' )
    ,( the_country_id, 'County', '19', 'Kwale' )
    ,( the_country_id, 'County', '20', 'Laikipia' )
    ,( the_country_id, 'County', '21', 'Lamu' )
    ,( the_country_id, 'County', '22', 'Machakos' )
    ,( the_country_id, 'County', '23', 'Makueni' )
    ,( the_country_id, 'County', '24', 'Mandera' )
    ,( the_country_id, 'County', '25', 'Marsabit' )
    ,( the_country_id, 'County', '26', 'Meru' )
    ,( the_country_id, 'County', '27', 'Migori' )
    ,( the_country_id, 'County', '28', 'Mombasa' )
    ,( the_country_id, 'County', '29', 'Murang''a' )
    ,( the_country_id, 'County', '30', 'Nairobi City' )
    ,( the_country_id, 'County', '31', 'Nakuru' )
    ,( the_country_id, 'County', '32', 'Nandi' )
    ,( the_country_id, 'County', '33', 'Narok' )
    ,( the_country_id, 'County', '34', 'Nyamira' )
    ,( the_country_id, 'County', '35', 'Nyandarua' )
    ,( the_country_id, 'County', '36', 'Nyeri' )
    ,( the_country_id, 'County', '37', 'Samburu' )
    ,( the_country_id, 'County', '38', 'Siaya' )
    ,( the_country_id, 'County', '39', 'Taita/Taveta' )
    ,( the_country_id, 'County', '40', 'Tana River' )
    ,( the_country_id, 'County', '41', 'Tharaka-Nithi' )
    ,( the_country_id, 'County', '42', 'Trans Nzoia' )
    ,( the_country_id, 'County', '43', 'Turkana' )
    ,( the_country_id, 'County', '44', 'Uasin Gishu' )
    ,( the_country_id, 'County', '45', 'Vihiga' )
    ,( the_country_id, 'County', '46', 'Wajir' )
    ,( the_country_id, 'County', '47', 'West Pokot' );
    
    -- Kyrgyzstan
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'KG' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'B', 'Batken' )
    ,( the_country_id, 'Region', 'C', 'Chü' )
    ,( the_country_id, 'City', 'GB', 'Bishkek' )
    ,( the_country_id, 'City', 'GO', 'Osh' )
    ,( the_country_id, 'Region', 'J', 'Jalal-Abad' )
    ,( the_country_id, 'Region', 'N', 'Naryn' )
    ,( the_country_id, 'Region', 'O', 'Osh' )
    ,( the_country_id, 'Region', 'T', 'Talas' )
    ,( the_country_id, 'Region', 'Y', 'Ysyk-Köl' );
    
    -- Cambodia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'KH' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', '1', 'Banteay Mean Chey [Bântéay Méanchey]' )
    ,( the_country_id, 'Province', '10', 'Kracheh [Krâchéh]' )
    ,( the_country_id, 'Province', '11', 'Mondol Kiri [Môndól Kiri]' )
    ,( the_country_id, 'Autonomous municipality', '12', 'Phnom Penh [Phnum Pénh]' )
    ,( the_country_id, 'Province', '13', 'Preah Vihear [Preah Vihéar]' )
    ,( the_country_id, 'Province', '14', 'Prey Veaeng [Prey Vêng]' )
    ,( the_country_id, 'Province', '15', 'Pousaat [Pouthisat]' )
    ,( the_country_id, 'Province', '16', 'Rotanak Kiri [Rôtânôkiri]' )
    ,( the_country_id, 'Province', '17', 'Siem Reab [Siemréab]' )
    ,( the_country_id, 'Autonomous municipality', '18', 'Krong Preah Sihanouk [Krong Preah Sihanouk]' )
    ,( the_country_id, 'Province', '19', 'Stueng Traeng [Stoeng Trêng]' )
    ,( the_country_id, 'Province', '2', 'Baat Dambang [Batdâmbâng]' )
    ,( the_country_id, 'Province', '20', 'Svaay Rieng [Svay Rieng]' )
    ,( the_country_id, 'Province', '21', 'Taakaev [Takêv]' )
    ,( the_country_id, 'Province', '22', 'Otdar Mean Chey [Otdâr Méanchey]' )
    ,( the_country_id, 'Autonomous municipality', '23', 'Krong Kaeb [Krong Kêb]' )
    ,( the_country_id, 'Autonomous municipality', '24', 'Krong Pailin [Krong Pailin]' )
    ,( the_country_id, 'Province', '3', 'Kampong Chaam [Kâmpóng Cham]' )
    ,( the_country_id, 'Province', '4', 'Kampong Chhnang [Kâmpóng Chhnang]' )
    ,( the_country_id, 'Province', '5', 'Kampong Spueu [Kâmpóng Spœ]' )
    ,( the_country_id, 'Province', '6', 'Kampong Thum [Kâmpóng Thum]' )
    ,( the_country_id, 'Province', '7', 'Kampot [Kâmpôt]' )
    ,( the_country_id, 'Province', '8', 'Kandaal [Kândal]' )
    ,( the_country_id, 'Province', '9', 'Kaoh Kong [Kaôh Kong]' );
    
    -- Kiribati
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'KI' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Group of islands', 'G', 'Gilbert Islands' )
    ,( the_country_id, 'Group of islands', 'L', 'Line Islands' )
    ,( the_country_id, 'Group of islands', 'P', 'Phoenix Islands' );
    
    -- Comoros
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'KM' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Island', 'A', 'Anjouan' )
    ,( the_country_id, 'Island', 'G', 'Grande Comore' )
    ,( the_country_id, 'Island', 'M', 'Mohéli' );
    
    -- Saint Kitts and Nevis
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'KN' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Parish', '01', 'Christ Church Nichola Town' )
    ,( the_country_id, 'Parish', '02', 'Saint Anne Sandy Point' )
    ,( the_country_id, 'Parish', '03', 'Saint George Basseterre' )
    ,( the_country_id, 'Parish', '04', 'Saint George Gingerland' )
    ,( the_country_id, 'Parish', '05', 'Saint James Windward' )
    ,( the_country_id, 'Parish', '06', 'Saint John Capisterre' )
    ,( the_country_id, 'Parish', '07', 'Saint John Figtree' )
    ,( the_country_id, 'Parish', '08', 'Saint Mary Cayon' )
    ,( the_country_id, 'Parish', '09', 'Saint Paul Capisterre' )
    ,( the_country_id, 'Parish', '10', 'Saint Paul Charlestown' )
    ,( the_country_id, 'Parish', '11', 'Saint Peter Basseterre' )
    ,( the_country_id, 'Parish', '12', 'Saint Thomas Lowland' )
    ,( the_country_id, 'Parish', '13', 'Saint Thomas Middle Island' )
    ,( the_country_id, 'Parish', '15', 'Trinity Palmetto Point' );
    
    -- Korea (Democratic People's Republic of)
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'KP' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Capital City', '01', 'Phyeongyang' )
    ,( the_country_id, 'Province', '02', 'Phyeongannamto' )
    ,( the_country_id, 'Province', '03', 'Phyeonganpukto' )
    ,( the_country_id, 'Province', '04', 'Jakangto' )
    ,( the_country_id, 'Province', '05', 'Hwanghainamto' )
    ,( the_country_id, 'Province', '06', 'Hwanghaipukto' )
    ,( the_country_id, 'Province', '07', 'Kangweonto' )
    ,( the_country_id, 'Province', '08', 'Hamkyeongnamto' )
    ,( the_country_id, 'Province', '09', 'Hamkyeongpukto' )
    ,( the_country_id, 'Province', '10', 'Yanggang-do' )
    ,( the_country_id, 'Special City', '13', 'Nason' );
    
    -- Korea (Republic of)
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'KR' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Special city', '11', 'Seoul-teukbyeolsi [Seoul]' )
    ,( the_country_id, 'Metropolitan city', '26', 'Busan Gwang''yeogsi [Pusan-Kwangyokshi]' )
    ,( the_country_id, 'Metropolitan city', '27', 'Daegu Gwang''yeogsi [Taegu-Kwangyokshi]' )
    ,( the_country_id, 'Metropolitan city', '28', 'Incheon Gwang''yeogsi [Incheon]' )
    ,( the_country_id, 'Metropolitan city', '29', 'Gwangju Gwang''yeogsi [Kwangju-Kwangyokshi]' )
    ,( the_country_id, 'Metropolitan city', '30', 'Daejeon Gwang''yeogsi [Taejon-Kwangyokshi]' )
    ,( the_country_id, 'Metropolitan city', '31', 'Ulsan Gwang''yeogsi [Ulsan-Kwangyokshi]' )
    ,( the_country_id, 'Province', '41', 'Gyeonggido [Kyonggi-do]' )
    ,( the_country_id, 'Province', '42', 'Gang''weondo [Kang-won-do]' )
    ,( the_country_id, 'Province', '43', 'Chungcheongbugdo [Ch''ungch''ongbuk-do]' )
    ,( the_country_id, 'Province', '44', 'Chungcheongnamdo [Ch''ungch''ongnam-do]' )
    ,( the_country_id, 'Province', '45', 'Jeonrabugdo [Chollabuk-do]' )
    ,( the_country_id, 'Province', '46', 'Jeonranamdo [Chollanam-do]' )
    ,( the_country_id, 'Province', '47', 'Gyeongsangbugdo [Kyongsangbuk-do]' )
    ,( the_country_id, 'Province', '48', 'Gyeongsangnamdo [Kyongsangnam-do]' )
    ,( the_country_id, 'Special self-governing province', '49', 'Jeju-teukbyeoljachido [Jeju]' )
    ,( the_country_id, 'Special self-governing city', '50', 'Sejong' );
    
    -- Kuwait
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'KW' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Governorate', 'AH', 'Al Aḩmadi' )
    ,( the_country_id, 'Governorate', 'FA', 'Al Farwaniyah' )
    ,( the_country_id, 'Governorate', 'HA', 'Ḩawallī' )
    ,( the_country_id, 'Governorate', 'JA', 'Al Jahra’' )
    ,( the_country_id, 'Governorate', 'KU', 'Al Kuwayt' )
    ,( the_country_id, 'Governorate', 'MU', 'Mubarak al Kabir' );
    
    -- Kazakhstan
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'KZ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'AKM', 'Aqmola oblysy' )
    ,( the_country_id, 'Region', 'AKT', 'Aqtöbe oblysy' )
    ,( the_country_id, 'City', 'ALA', 'Almaty' )
    ,( the_country_id, 'Region', 'ALM', 'Almaty oblysy' )
    ,( the_country_id, 'City', 'AST', 'Astana' )
    ,( the_country_id, 'Region', 'ATY', 'Atyrau oblysy' )
    ,( the_country_id, 'Region', 'KAR', 'Qaraghandy oblysy' )
    ,( the_country_id, 'Region', 'KUS', 'Qostanay oblysy' )
    ,( the_country_id, 'Region', 'KZY', 'Qyzylorda oblysy' )
    ,( the_country_id, 'Region', 'MAN', 'Mangghystau oblysy' )
    ,( the_country_id, 'Region', 'PAV', 'Pavlodar oblysy' )
    ,( the_country_id, 'Region', 'SEV', 'Soltüstik Qazaqstan oblysy' )
    ,( the_country_id, 'Region', 'VOS', 'Shyghys Qazaqstan oblysy' )
    ,( the_country_id, 'Region', 'YUZ', 'Ongtüstik Qazaqstan oblysy' )
    ,( the_country_id, 'Region', 'ZAP', 'Batys Qazaqstan oblysy' )
    ,( the_country_id, 'Region', 'ZHA', 'Zhambyl oblysy' );
    
    -- Lao People's Democratic Republic
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'LA' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'AT', 'Attapu [Attopeu]' )
    ,( the_country_id, 'Province', 'BK', 'Bokèo' )
    ,( the_country_id, 'Province', 'BL', 'Bolikhamxai [Borikhane]' )
    ,( the_country_id, 'Province', 'CH', 'Champasak [Champassak]' )
    ,( the_country_id, 'Province', 'HO', 'Houaphan' )
    ,( the_country_id, 'Province', 'KH', 'Khammouan' )
    ,( the_country_id, 'Province', 'LM', 'Louang Namtha' )
    ,( the_country_id, 'Province', 'LP', 'Louangphabang [Louang Prabang)' )
    ,( the_country_id, 'Province', 'OU', 'Oudômxai [Oudomsai]' )
    ,( the_country_id, 'Province', 'PH', 'Phôngsali [Phong Saly]' )
    ,( the_country_id, 'Province', 'SL', 'Salavan [Saravane]' )
    ,( the_country_id, 'Province', 'SV', 'Savannakhét' )
    ,( the_country_id, 'Province', 'VI', 'Vientiane' )
    ,( the_country_id, 'Prefecture', 'VT', 'Vientiane' )
    ,( the_country_id, 'Province', 'XA', 'Xaignabouli [Sayaboury]' )
    ,( the_country_id, 'Province', 'XE', 'Xékong [Sékong]' )
    ,( the_country_id, 'Province', 'XI', 'Xiangkhouang [Xieng Khouang]' )
    ,( the_country_id, 'Special zone', 'XN', 'Xaisômboun' );
    
    -- Lebanon
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'LB' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Governorate', 'AK', 'Aakkâr' )
    ,( the_country_id, 'Governorate', 'AS', 'Liban-Nord' )
    ,( the_country_id, 'Governorate', 'BA', 'Beyrouth' )
    ,( the_country_id, 'Governorate', 'BH', 'Baalbek-Hermel' )
    ,( the_country_id, 'Governorate', 'BI', 'El Béqaa' )
    ,( the_country_id, 'Governorate', 'JA', 'Liban-Sud' )
    ,( the_country_id, 'Governorate', 'JL', 'Mont-Liban' )
    ,( the_country_id, 'Governorate', 'NA', 'Nabatîyé' );
    
    -- Saint Lucia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'LC' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', '01', 'Anse la Raye' )
    ,( the_country_id, 'District', '02', 'Castries' )
    ,( the_country_id, 'District', '03', 'Choiseul' )
    ,( the_country_id, 'District', '05', 'Dennery' )
    ,( the_country_id, 'District', '06', 'Gros Islet' )
    ,( the_country_id, 'District', '07', 'Laborie' )
    ,( the_country_id, 'District', '08', 'Micoud' )
    ,( the_country_id, 'District', '10', 'Soufrière' )
    ,( the_country_id, 'District', '11', 'Vieux Fort' )
    ,( the_country_id, 'District', '12', 'Canaries' );
    
    -- Liechtenstein
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'LI' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Commune', '01', 'Balzers' )
    ,( the_country_id, 'Commune', '02', 'Eschen' )
    ,( the_country_id, 'Commune', '03', 'Gamprin' )
    ,( the_country_id, 'Commune', '04', 'Mauren' )
    ,( the_country_id, 'Commune', '05', 'Planken' )
    ,( the_country_id, 'Commune', '06', 'Ruggell' )
    ,( the_country_id, 'Commune', '07', 'Schaan' )
    ,( the_country_id, 'Commune', '08', 'Schellenberg' )
    ,( the_country_id, 'Commune', '09', 'Triesen' )
    ,( the_country_id, 'Commune', '10', 'Triesenberg' )
    ,( the_country_id, 'Commune', '11', 'Vaduz' );
    
    -- Sri Lanka
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'LK' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', '1', 'Basnāhira paḷāta' )
    ,( the_country_id, 'District', '11', 'Colombo' )
    ,( the_country_id, 'District', '12', 'Gampaha' )
    ,( the_country_id, 'District', '13', 'Kalutara' )
    ,( the_country_id, 'Province', '2', 'Madhyama paḷāta' )
    ,( the_country_id, 'District', '21', 'Kandy' )
    ,( the_country_id, 'District', '22', 'Matale' )
    ,( the_country_id, 'District', '23', 'Nuwara Eliya' )
    ,( the_country_id, 'Province', '3', 'Dakuṇu paḷāta' )
    ,( the_country_id, 'District', '31', 'Galle' )
    ,( the_country_id, 'District', '32', 'Matara' )
    ,( the_country_id, 'District', '33', 'Hambantota' )
    ,( the_country_id, 'Province', '4', 'Uturu paḷāta' )
    ,( the_country_id, 'District', '41', 'Jaffna' )
    ,( the_country_id, 'District', '42', 'Kilinochchi' )
    ,( the_country_id, 'District', '43', 'Mannar' )
    ,( the_country_id, 'District', '44', 'Vavuniya' )
    ,( the_country_id, 'District', '45', 'Mullaittivu' )
    ,( the_country_id, 'Province', '5', 'Næ̆gĕnahira paḷāta' )
    ,( the_country_id, 'District', '51', 'Batticaloa' )
    ,( the_country_id, 'District', '52', 'Ampara' )
    ,( the_country_id, 'District', '53', 'Trincomalee' )
    ,( the_country_id, 'Province', '6', 'Vayamba paḷāta' )
    ,( the_country_id, 'District', '61', 'Kurunegala' )
    ,( the_country_id, 'District', '62', 'Puttalam' )
    ,( the_country_id, 'Province', '7', 'Uturumæ̆da paḷāta' )
    ,( the_country_id, 'District', '71', 'Anuradhapura' )
    ,( the_country_id, 'District', '72', 'Polonnaruwa' )
    ,( the_country_id, 'Province', '8', 'Ūva paḷāta' )
    ,( the_country_id, 'District', '81', 'Badulla' )
    ,( the_country_id, 'District', '82', 'Monaragala' )
    ,( the_country_id, 'Province', '9', 'Sabaragamuva paḷāta' )
    ,( the_country_id, 'District', '91', 'Ratnapura' )
    ,( the_country_id, 'District', '92', 'Kegalla' );
    
    -- Liberia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'LR' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'County', 'BG', 'Bong' )
    ,( the_country_id, 'County', 'BM', 'Bomi' )
    ,( the_country_id, 'County', 'CM', 'Grand Cape Mount' )
    ,( the_country_id, 'County', 'GB', 'Grand Bassa' )
    ,( the_country_id, 'County', 'GG', 'Grand Gedeh' )
    ,( the_country_id, 'County', 'GK', 'Grand Kru' )
    ,( the_country_id, 'County', 'GP', 'Gbarpolu' )
    ,( the_country_id, 'County', 'LO', 'Lofa' )
    ,( the_country_id, 'County', 'MG', 'Margibi' )
    ,( the_country_id, 'County', 'MO', 'Montserrado' )
    ,( the_country_id, 'County', 'MY', 'Maryland' )
    ,( the_country_id, 'County', 'NI', 'Nimba' )
    ,( the_country_id, 'County', 'RG', 'River Gee' )
    ,( the_country_id, 'County', 'RI', 'Rivercess' )
    ,( the_country_id, 'County', 'SI', 'Sinoe' );
    
    -- Lesotho
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'LS' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', 'A', 'Maseru' )
    ,( the_country_id, 'District', 'B', 'Butha-Buthe' )
    ,( the_country_id, 'District', 'C', 'Leribe' )
    ,( the_country_id, 'District', 'D', 'Berea' )
    ,( the_country_id, 'District', 'E', 'Mafeteng' )
    ,( the_country_id, 'District', 'F', 'Mohale''s Hoek''' )
    ,( the_country_id, 'District', 'G', 'Quthing' )
    ,( the_country_id, 'District', 'H', 'Qacha''s Nek' )
    ,( the_country_id, 'District', 'J', 'Mokhotlong' )
    ,( the_country_id, 'District', 'K', 'Thaba-Tseka' );
    
    -- Lithuania
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'LT' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District municipality', '01', 'Akmene' )
    ,( the_country_id, 'City municipality', '02', 'Alytaus miestas' )
    ,( the_country_id, 'District municipality', '03', 'Alytus' )
    ,( the_country_id, 'District municipality', '04', 'Anykšciai' )
    ,( the_country_id, 'Municipality', '05', 'Birštono' )
    ,( the_country_id, 'District municipality', '06', 'Biržai' )
    ,( the_country_id, 'Municipality', '07', 'Druskininkai' )
    ,( the_country_id, 'Municipality', '08', 'Elektrénai' )
    ,( the_country_id, 'District municipality', '09', 'Ignalina' )
    ,( the_country_id, 'District municipality', '10', 'Jonava' )
    ,( the_country_id, 'District municipality', '11', 'Joniškis' )
    ,( the_country_id, 'District municipality', '12', 'Jurbarkas' )
    ,( the_country_id, 'District municipality', '13', 'Kaišiadorys' )
    ,( the_country_id, 'Municipality', '14', 'Kalvarijos' )
    ,( the_country_id, 'City municipality', '15', 'Kauno miestas' )
    ,( the_country_id, 'District municipality', '16', 'Kaunas' )
    ,( the_country_id, 'Municipality', '17', 'Kazlu Rudos' )
    ,( the_country_id, 'District municipality', '18', 'Kedainiai' )
    ,( the_country_id, 'District municipality', '19', 'Kelme' )
    ,( the_country_id, 'City municipality', '20', 'Klaipedos miestas' )
    ,( the_country_id, 'District municipality', '21', 'Klaipeda' )
    ,( the_country_id, 'District municipality', '22', 'Kretinga' )
    ,( the_country_id, 'District municipality', '23', 'Kupiškis' )
    ,( the_country_id, 'District municipality', '24', 'Lazdijai' )
    ,( the_country_id, 'District municipality', '25', 'Marijampole' )
    ,( the_country_id, 'District municipality', '26', 'Mažeikiai' )
    ,( the_country_id, 'District municipality', '27', 'Moletai' )
    ,( the_country_id, 'Municipality', '28', 'Neringa' )
    ,( the_country_id, 'Municipality', '29', 'Pagégiai' )
    ,( the_country_id, 'District municipality', '30', 'Pakruojis' )
    ,( the_country_id, 'City municipality', '31', 'Palangos miestas' )
    ,( the_country_id, 'City municipality', '32', 'Panevežio miestas' )
    ,( the_country_id, 'District municipality', '33', 'Panevežys' )
    ,( the_country_id, 'District municipality', '34', 'Pasvalys' )
    ,( the_country_id, 'District municipality', '35', 'Plunge' )
    ,( the_country_id, 'District municipality', '36', 'Prienai' )
    ,( the_country_id, 'District municipality', '37', 'Radviliškis' )
    ,( the_country_id, 'District municipality', '38', 'Raseiniai' )
    ,( the_country_id, 'Municipality', '39', 'Rietavo' )
    ,( the_country_id, 'District municipality', '40', 'Rokiškis' )
    ,( the_country_id, 'District municipality', '41', 'Šakiai' )
    ,( the_country_id, 'District municipality', '42', 'Šalcininkai' )
    ,( the_country_id, 'City municipality', '43', 'Šiauliu miestas' )
    ,( the_country_id, 'District municipality', '44', 'Šiauliai' )
    ,( the_country_id, 'District municipality', '45', 'Šilale' )
    ,( the_country_id, 'District municipality', '46', 'Šilute' )
    ,( the_country_id, 'District municipality', '47', 'Širvintos' )
    ,( the_country_id, 'District municipality', '48', 'Skuodas' )
    ,( the_country_id, 'District municipality', '49', 'Švencionys' )
    ,( the_country_id, 'District municipality', '50', 'Taurage' )
    ,( the_country_id, 'District municipality', '51', 'Telšiai' )
    ,( the_country_id, 'District municipality', '52', 'Trakai' )
    ,( the_country_id, 'District municipality', '53', 'Ukmerge' )
    ,( the_country_id, 'District municipality', '54', 'Utena' )
    ,( the_country_id, 'District municipality', '55', 'Varena' )
    ,( the_country_id, 'District municipality', '56', 'Vilkaviškis' )
    ,( the_country_id, 'City municipality', '57', 'Vilniaus miestas' )
    ,( the_country_id, 'District municipality', '58', 'Vilnius' )
    ,( the_country_id, 'Municipality', '59', 'Visaginas' )
    ,( the_country_id, 'District municipality', '60', 'Zarasai' )
    ,( the_country_id, 'County', 'AL', 'Alytaus Apskritis' )
    ,( the_country_id, 'County', 'KL', 'Klaipedos apskritis' )
    ,( the_country_id, 'County', 'KU', 'Kauno Apskritis' )
    ,( the_country_id, 'County', 'MR', 'Marijampoles apskritis' )
    ,( the_country_id, 'County', 'PN', 'Panevežio apskritis' )
    ,( the_country_id, 'County', 'SA', 'Šiauliu Apskritis' )
    ,( the_country_id, 'County', 'TA', 'Taurages apskritis' )
    ,( the_country_id, 'County', 'TE', 'Telšiu Apskritis' )
    ,( the_country_id, 'County', 'UT', 'Utenos Apskritis' )
    ,( the_country_id, 'County', 'VL', 'Vilniaus Apskritis' );
    
    -- Luxembourg
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'LU' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', 'D', 'Diekirch' )
    ,( the_country_id, 'District', 'G', 'Grevenmacher' )
    ,( the_country_id, 'District', 'L', 'Luxembourg' );
    
    -- Latvia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'LV' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Municipality', '001', 'Aglonas novads (Aglona)' )
    ,( the_country_id, 'Municipality', '002', 'Aizkraukles novads (Aizkraukle)' )
    ,( the_country_id, 'Municipality', '003', 'Aizputes novads (Aizpute)' )
    ,( the_country_id, 'Municipality', '004', 'Aknistes novads (Akniste)' )
    ,( the_country_id, 'Municipality', '005', 'Alojas novads (Aloja)' )
    ,( the_country_id, 'Municipality', '006', 'Alsungas novads (Alsunga)' )
    ,( the_country_id, 'Municipality', '007', 'Aluksnes novads (Aluksne)' )
    ,( the_country_id, 'Municipality', '008', 'Amatas novads (Amata)' )
    ,( the_country_id, 'Municipality', '009', 'Apes novads (Ape)' )
    ,( the_country_id, 'Municipality', '010', 'Auces novads (Auce)' )
    ,( the_country_id, 'Municipality', '011', 'Adažu novads (Adaži)' )
    ,( the_country_id, 'Municipality', '012', 'Babites novads (Babite)' )
    ,( the_country_id, 'Municipality', '013', 'Baldones novads (Baldone)' )
    ,( the_country_id, 'Municipality', '014', 'Baltinavas novads (Baltinava)' )
    ,( the_country_id, 'Municipality', '015', 'Balvu novads (Balvi)' )
    ,( the_country_id, 'Municipality', '016', 'Bauskas novads (Bauska)' )
    ,( the_country_id, 'Municipality', '017', 'Beverinas novads (Beverina)' )
    ,( the_country_id, 'Municipality', '018', 'Brocenu novads (Broceni)' )
    ,( the_country_id, 'Municipality', '019', 'Burtnieku novads (Burtnieki)' )
    ,( the_country_id, 'Municipality', '020', 'Carnikavas novads (Carnikava)' )
    ,( the_country_id, 'Municipality', '021', 'Cesvaines novads (Cesvaine)' )
    ,( the_country_id, 'Municipality', '022', 'Cesu novads (Cesis)' )
    ,( the_country_id, 'Municipality', '023', 'Ciblas novads (Cibla)' )
    ,( the_country_id, 'Municipality', '024', 'Dagdas novads (Dagda)' )
    ,( the_country_id, 'Municipality', '025', 'Daugavpils novads (Daugavpils)' )
    ,( the_country_id, 'Municipality', '026', 'Dobeles novads (Dobele)' )
    ,( the_country_id, 'Municipality', '027', 'Dundagas novads (Dundaga)' )
    ,( the_country_id, 'Municipality', '028', 'Durbes novads (Durbe)' )
    ,( the_country_id, 'Municipality', '029', 'Engures novads (Engure)' )
    ,( the_country_id, 'Municipality', '030', 'Erglu novads (Ergli)' )
    ,( the_country_id, 'Municipality', '031', 'Garkalnes novads (Garkalne)' )
    ,( the_country_id, 'Municipality', '032', 'Grobinas novads (Grobina)' )
    ,( the_country_id, 'Municipality', '033', 'Gulbenes novads (Gulbene)' )
    ,( the_country_id, 'Municipality', '034', 'Iecavas novads (Iecava)' )
    ,( the_country_id, 'Municipality', '035', 'Ikškiles novads (Ikškile)' )
    ,( the_country_id, 'Municipality', '036', 'Ilukstes novads (Ilukste)' )
    ,( the_country_id, 'Municipality', '037', 'Incukalna novads (Incukalns)' )
    ,( the_country_id, 'Municipality', '038', 'Jaunjelgavas novads (Jaunjelgava)' )
    ,( the_country_id, 'Municipality', '039', 'Jaunpiebalgas novads (Jaunpiebalga)' )
    ,( the_country_id, 'Municipality', '040', 'Jaunpils novads (Jaunpils)' )
    ,( the_country_id, 'Municipality', '041', 'Jelgavas novads (Jelgava)' )
    ,( the_country_id, 'Municipality', '042', 'Jekabpils novads (Jekabpils)' )
    ,( the_country_id, 'Municipality', '043', 'Kandavas novads (Kandava)' )
    ,( the_country_id, 'Municipality', '044', 'Karsavas novads (Karsava)' )
    ,( the_country_id, 'Municipality', '045', 'Kocenu novads (Koceni)' )
    ,( the_country_id, 'Municipality', '046', 'Kokneses novads (Koknese)' )
    ,( the_country_id, 'Municipality', '047', 'Kraslavas novads (Kraslava)' )
    ,( the_country_id, 'Municipality', '048', 'Krimuldas novads (Krimulda)' )
    ,( the_country_id, 'Municipality', '049', 'Krustpils novads (Krustpils)' )
    ,( the_country_id, 'Municipality', '050', 'Kuldigas novads (Kuldiga)' )
    ,( the_country_id, 'Municipality', '051', 'Keguma novads (Kegums)' )
    ,( the_country_id, 'Municipality', '052', 'Kekavas novads (Kekava)' )
    ,( the_country_id, 'Municipality', '053', 'Lielvardes novads (Lielvarde)' )
    ,( the_country_id, 'Municipality', '054', 'Limbažu novads (Limbaži)' )
    ,( the_country_id, 'Municipality', '055', 'Ligatnes novads (Ligatne)' )
    ,( the_country_id, 'Municipality', '056', 'Livanu novads (Livani)' )
    ,( the_country_id, 'Municipality', '057', 'Lubanas novads (Lubana)' )
    ,( the_country_id, 'Municipality', '058', 'Ludzas novads (Ludza)' )
    ,( the_country_id, 'Municipality', '059', 'Madonas novads (Madona)' )
    ,( the_country_id, 'Municipality', '060', 'Mazsalacas novads (Mazsalaca)' )
    ,( the_country_id, 'Municipality', '061', 'Malpils novads (Malpils)' )
    ,( the_country_id, 'Municipality', '062', 'Marupes novads (Marupe)' )
    ,( the_country_id, 'Municipality', '063', 'Mersraga novads (Mersrags)' )
    ,( the_country_id, 'Municipality', '064', 'Naukšenu novads (Naukšeni)' )
    ,( the_country_id, 'Municipality', '065', 'Neretas novads (Nereta)' )
    ,( the_country_id, 'Municipality', '066', 'Nicas novads (Nica)' )
    ,( the_country_id, 'Municipality', '067', 'Ogres novads (Ogre)' )
    ,( the_country_id, 'Municipality', '068', 'Olaines novads (Olaine)' )
    ,( the_country_id, 'Municipality', '069', 'Ozolnieku novads (Ozolnieki)' )
    ,( the_country_id, 'Municipality', '070', 'Pargaujas novads (Pargauja)' )
    ,( the_country_id, 'Municipality', '071', 'Pavilostas novads (Pavilosta)' )
    ,( the_country_id, 'Municipality', '072', 'Plavinu novads (Plavinas)' )
    ,( the_country_id, 'Municipality', '073', 'Preilu novads (Preili)' )
    ,( the_country_id, 'Municipality', '074', 'Priekules novads (Priekule)' )
    ,( the_country_id, 'Municipality', '075', 'Priekulu novads (Priekuli)' )
    ,( the_country_id, 'Municipality', '076', 'Raunas novads (Rauna)' )
    ,( the_country_id, 'Municipality', '077', 'Rezeknes novads (Rezekne)' )
    ,( the_country_id, 'Municipality', '078', 'Riebinu novads (Riebini)' )
    ,( the_country_id, 'Municipality', '079', 'Rojas novads (Roja)' )
    ,( the_country_id, 'Municipality', '080', 'Ropažu novads (Ropaži)' )
    ,( the_country_id, 'Municipality', '081', 'Rucavas novads (Rucava)' )
    ,( the_country_id, 'Municipality', '082', 'Rugaju novads (Rugaji)' )
    ,( the_country_id, 'Municipality', '083', 'Rundales novads (Rundale)' )
    ,( the_country_id, 'Municipality', '084', 'Rujienas novads (Rujiena)' )
    ,( the_country_id, 'Municipality', '085', 'Salas novads (Sala)' )
    ,( the_country_id, 'Municipality', '086', 'Salacgrivas novads (Salacgriva)' )
    ,( the_country_id, 'Municipality', '087', 'Salaspils novads (Salaspils)' )
    ,( the_country_id, 'Municipality', '088', 'Saldus novads (Saldus)' )
    ,( the_country_id, 'Municipality', '089', 'Saulkrastu novads (Saulkrasti)' )
    ,( the_country_id, 'Municipality', '090', 'Sejas novads (Seja)' )
    ,( the_country_id, 'Municipality', '091', 'Siguldas novads (Sigulda)' )
    ,( the_country_id, 'Municipality', '092', 'Skriveru novads (Skriveri)' )
    ,( the_country_id, 'Municipality', '093', 'Skrundas novads (Skrunda)' )
    ,( the_country_id, 'Municipality', '094', 'Smiltenes novads (Smiltene)' )
    ,( the_country_id, 'Municipality', '095', 'Stopinu novads (Stopini)' )
    ,( the_country_id, 'Municipality', '096', 'Strencu novads (Strenci)' )
    ,( the_country_id, 'Municipality', '097', 'Talsu novads (Talsi)' )
    ,( the_country_id, 'Municipality', '098', 'Tervetes novads (Tervete)' )
    ,( the_country_id, 'Municipality', '099', 'Tukuma novads (Tukums)' )
    ,( the_country_id, 'Municipality', '100', 'Vainodes novads (Vainode)' )
    ,( the_country_id, 'Municipality', '101', 'Valkas novads (Valka)' )
    ,( the_country_id, 'Municipality', '102', 'Varaklanu novads (Varaklani)' )
    ,( the_country_id, 'Municipality', '103', 'Varkavas novads (Varkava)' )
    ,( the_country_id, 'Municipality', '104', 'Vecpiebalgas novads (Vecpiebalga)' )
    ,( the_country_id, 'Municipality', '105', 'Vecumnieku novads (Vecumnieki)' )
    ,( the_country_id, 'Municipality', '106', 'Ventspils novads (Ventspils)' )
    ,( the_country_id, 'Municipality', '107', 'Viesites novads (Viesite)' )
    ,( the_country_id, 'Municipality', '108', 'Vilakas novads (Vilaka)' )
    ,( the_country_id, 'Municipality', '109', 'Vilanu novads (Vilani)' )
    ,( the_country_id, 'Municipality', '110', 'Zilupes novads (Zilupe)' )
    ,( the_country_id, 'Republican city', 'DGV', 'Daugavpils' )
    ,( the_country_id, 'Republican city', 'JEL', 'Jelgava' )
    ,( the_country_id, 'Republican city', 'JKB', 'Jekabpils' )
    ,( the_country_id, 'Republican city', 'JUR', 'Jurmala' )
    ,( the_country_id, 'Republican city', 'LPX', 'Liepaja' )
    ,( the_country_id, 'Republican city', 'REZ', 'Rezekne' )
    ,( the_country_id, 'Republican city', 'RIX', 'Riga' )
    ,( the_country_id, 'Republican city', 'VEN', 'Ventspils' )
    ,( the_country_id, 'Republican city', 'VMR', 'Valmiera' );
    
    -- Libya
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'LY' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Popularate', 'BA', 'Banghazi' )
    ,( the_country_id, 'Popularate', 'BU', 'Al Butnan' )
    ,( the_country_id, 'Popularate', 'DR', 'Darnah' )
    ,( the_country_id, 'Popularate', 'GT', 'Ghat' )
    ,( the_country_id, 'Popularate', 'JA', 'Al Jabal al Akhḑar' )
    ,( the_country_id, 'Popularate', 'JG', 'Al Jabal al Gharbi' )
    ,( the_country_id, 'Popularate', 'JI', 'Al Jifarah' )
    ,( the_country_id, 'Popularate', 'JU', 'Al Jufrah' )
    ,( the_country_id, 'Popularate', 'KF', 'Al Kufrah' )
    ,( the_country_id, 'Popularate', 'MB', 'Al Marqab' )
    ,( the_country_id, 'Popularate', 'MI', 'Misratah' )
    ,( the_country_id, 'Popularate', 'MJ', 'Al Marj' )
    ,( the_country_id, 'Popularate', 'MQ', 'Murzuq' )
    ,( the_country_id, 'Popularate', 'NL', 'Nalut' )
    ,( the_country_id, 'Popularate', 'NQ', 'An Nuqat al Khams' )
    ,( the_country_id, 'Popularate', 'SB', 'Sabha' )
    ,( the_country_id, 'Popularate', 'SR', 'Surt' )
    ,( the_country_id, 'Popularate', 'TB', 'Tarabulus' )
    ,( the_country_id, 'Popularate', 'WA', 'Al Wāḩāt' )
    ,( the_country_id, 'Popularate', 'WD', 'Wadi al Hayat' )
    ,( the_country_id, 'Popularate', 'WS', 'Wādī ash Shāţiʾ' )
    ,( the_country_id, 'Popularate', 'ZA', 'Az Zawiyah' );
    
    -- Morocco
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MA' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Economic Region', '01', 'Tanger-Tétouan' )
    ,( the_country_id, 'Economic Region', '02', 'Gharb-Chrarda-Beni Hssen' )
    ,( the_country_id, 'Economic Region', '03', 'Taza-Al Hoceima-Taounate' )
    ,( the_country_id, 'Economic Region', '04', 'L''Oriental' )
    ,( the_country_id, 'Economic Region', '05', 'Fès-Boulemane' )
    ,( the_country_id, 'Economic Region', '06', 'Meknès-Tafilalet' )
    ,( the_country_id, 'Economic Region', '07', 'Rabat-Salé-Zemmour-Zaer' )
    ,( the_country_id, 'Economic Region', '08', 'Grand Casablanca' )
    ,( the_country_id, 'Economic Region', '09', 'Chaouia-Ouardigha' )
    ,( the_country_id, 'Economic Region', '10', 'Doukhala-Abda' )
    ,( the_country_id, 'Economic Region', '11', 'Marrakech-Tensift-Al Haouz' )
    ,( the_country_id, 'Economic Region', '12', 'Tadla-Azilal' )
    ,( the_country_id, 'Economic Region', '13', 'Sous-Massa-Draa' )
    ,( the_country_id, 'Economic Region', '14', 'Guelmim-Es Semara' )
    ,( the_country_id, 'Economic Region', '15', 'Laâyoune-Boujdour-Sakia el Hamra' )
    ,( the_country_id, 'Economic Region', '16', 'Oued ed Dahab-Lagouira' )
    ,( the_country_id, 'Prefecture', 'AGD', 'Agadir-Ida-Outanane' )
    ,( the_country_id, 'Prefecture', 'AOU', 'Aousserd' )
    ,( the_country_id, 'Province', 'ASZ', 'Assa-Zag' )
    ,( the_country_id, 'Province', 'AZI', 'Azilal' )
    ,( the_country_id, 'Province', 'BEM', 'Beni Mellal' )
    ,( the_country_id, 'Province', 'BER', 'Berkane' )
    ,( the_country_id, 'Province', 'BES', 'Ben Slimane' )
    ,( the_country_id, 'Province', 'BOD', 'Boujdour' )
    ,( the_country_id, 'Province', 'BOM', 'Boulemane' )
    ,( the_country_id, 'Prefecture', 'CAS', 'Casablanca [Dar el Beïda]' )
    ,( the_country_id, 'Province', 'CHE', 'Chefchaouene' )
    ,( the_country_id, 'Province', 'CHI', 'Chichaoua' )
    ,( the_country_id, 'Province', 'CHT', 'Chtouka-Ait Baha' )
    ,( the_country_id, 'Province', 'ERR', 'Errachidia' )
    ,( the_country_id, 'Province', 'ESI', 'Essaouira' )
    ,( the_country_id, 'Province', 'ESM', 'Es Smara' )
    ,( the_country_id, 'Prefecture', 'FAH', 'Fahs-Beni Makada' )
    ,( the_country_id, 'Prefecture', 'FES', 'Fès-Dar-Dbibegh' )
    ,( the_country_id, 'Province', 'FIG', 'Figuig' )
    ,( the_country_id, 'Province', 'GUE', 'Guelmim' )
    ,( the_country_id, 'Province', 'HAJ', 'El Hajeb' )
    ,( the_country_id, 'Province', 'HAO', 'Al Haouz' )
    ,( the_country_id, 'Province', 'HOC', 'Al Hoceïma' )
    ,( the_country_id, 'Province', 'IFR', 'Ifrane' )
    ,( the_country_id, 'Prefecture', 'INE', 'Inezgane-Ait Melloul' )
    ,( the_country_id, 'Province', 'JDI', 'El Jadida' )
    ,( the_country_id, 'Province', 'JRA', 'Jrada' )
    ,( the_country_id, 'Province', 'KEN', 'Kénitra' )
    ,( the_country_id, 'Province', 'KES', 'Kelaat Sraghna' )
    ,( the_country_id, 'Province', 'KHE', 'Khemisset' )
    ,( the_country_id, 'Province', 'KHN', 'Khenifra' )
    ,( the_country_id, 'Province', 'KHO', 'Khouribga' )
    ,( the_country_id, 'Province', 'LAA', 'Laâyoune' )
    ,( the_country_id, 'Province', 'LAR', 'Larache' )
    ,( the_country_id, 'Province', 'MED', 'Médiouna' )
    ,( the_country_id, 'Prefecture', 'MEK', 'Meknès' )
    ,( the_country_id, 'Prefecture', 'MMD', 'Marrakech-Medina' )
    ,( the_country_id, 'Prefecture', 'MMN', 'Marrakech-Menara' )
    ,( the_country_id, 'Prefecture', 'MOH', 'Mohammadia' )
    ,( the_country_id, 'Province', 'MOU', 'Moulay Yacoub' )
    ,( the_country_id, 'Province', 'NAD', 'Nador' )
    ,( the_country_id, 'Province', 'NOU', 'Nouaceur' )
    ,( the_country_id, 'Province', 'OUA', 'Ouarzazate' )
    ,( the_country_id, 'Province', 'OUD', 'Oued ed Dahab' )
    ,( the_country_id, 'Prefecture', 'OUJ', 'Oujda-Angad' )
    ,( the_country_id, 'Prefecture', 'RAB', 'Rabat' )
    ,( the_country_id, 'Province', 'SAF', 'Safi' )
    ,( the_country_id, 'Prefecture', 'SAL', 'Salé' )
    ,( the_country_id, 'Province', 'SEF', 'Sefrou' )
    ,( the_country_id, 'Province', 'SET', 'Settat' )
    ,( the_country_id, 'Province', 'SIK', 'Sidi Kacem' )
    ,( the_country_id, 'Prefecture', 'SKH', 'Skhirate-Témara' )
    ,( the_country_id, 'Prefecture', 'SYB', 'Sidi Youssef Ben Ali' )
    ,( the_country_id, 'Province', 'TAI', 'Taourirt' )
    ,( the_country_id, 'Province', 'TAO', 'Taounate' )
    ,( the_country_id, 'Province', 'TAR', 'Taroudannt' )
    ,( the_country_id, 'Province', 'TAT', 'Tata' )
    ,( the_country_id, 'Province', 'TAZ', 'Taza' )
    ,( the_country_id, 'Prefecture', 'TET', 'Tétouan' )
    ,( the_country_id, 'Province', 'TIZ', 'Tiznit' )
    ,( the_country_id, 'Prefecture', 'TNG', 'Tanger-Assilah' )
    ,( the_country_id, 'Province', 'TNT', 'Tan-Tan' )
    ,( the_country_id, 'Province', 'ZAG', 'Zagora' );
    
    -- Monaco
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MC' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Quarter', 'CL', 'La Colle' )
    ,( the_country_id, 'Quarter', 'CO', 'La Condamine' )
    ,( the_country_id, 'Quarter', 'FO', 'Fontvieille' )
    ,( the_country_id, 'Quarter', 'GA', 'La Gare' )
    ,( the_country_id, 'Quarter', 'JE', 'Jardin Exotique' )
    ,( the_country_id, 'Quarter', 'LA', 'Larvotto' )
    ,( the_country_id, 'Quarter', 'MA', 'Malbousquet' )
    ,( the_country_id, 'Quarter', 'MC', 'Monte-Carlo' )
    ,( the_country_id, 'Quarter', 'MG', 'Moneghetti' )
    ,( the_country_id, 'Quarter', 'MO', 'Monaco-Ville' )
    ,( the_country_id, 'Quarter', 'MU', 'Moulins' )
    ,( the_country_id, 'Quarter', 'PH', 'Port-Hercule' )
    ,( the_country_id, 'Quarter', 'SD', 'Sainte-Dévote' )
    ,( the_country_id, 'Quarter', 'SO', 'La Source' )
    ,( the_country_id, 'Quarter', 'SP', 'Spélugues' )
    ,( the_country_id, 'Quarter', 'SR', 'Saint-Roman' )
    ,( the_country_id, 'Quarter', 'VR', 'Vallon de la Rousse' );
    
    -- Moldova (Republic of)
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MD' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', 'AN', 'Anenii Noi' )
    ,( the_country_id, 'City', 'BA', 'Balti' )
    ,( the_country_id, 'City', 'BD', 'Bender [Tighina]' )
    ,( the_country_id, 'District', 'BR', 'Briceni' )
    ,( the_country_id, 'District', 'BS', 'Basarabeasca' )
    ,( the_country_id, 'District', 'CA', 'Cahul' )
    ,( the_country_id, 'District', 'CL', 'Calarasi' )
    ,( the_country_id, 'District', 'CM', 'Cimislia' )
    ,( the_country_id, 'District', 'CR', 'Criuleni' )
    ,( the_country_id, 'District', 'CS', 'Causeni' )
    ,( the_country_id, 'District', 'CT', 'Cantemir' )
    ,( the_country_id, 'City', 'CU', 'Chisinau' )
    ,( the_country_id, 'District', 'DO', 'Donduseni' )
    ,( the_country_id, 'District', 'DR', 'Drochia' )
    ,( the_country_id, 'District', 'DU', 'Dubasari' )
    ,( the_country_id, 'District', 'ED', 'Edinet' )
    ,( the_country_id, 'District', 'FA', 'Falesti' )
    ,( the_country_id, 'District', 'FL', 'Floresti' )
    ,( the_country_id, 'Autonomous territory unit', 'GA', 'Gagauzia, Unitatea teritoriala autonoma (UTAG)' )
    ,( the_country_id, 'District', 'GL', 'Glodeni' )
    ,( the_country_id, 'District', 'HI', 'Hîncesti' )
    ,( the_country_id, 'District', 'IA', 'Ialoveni' )
    ,( the_country_id, 'District', 'LE', 'Leova' )
    ,( the_country_id, 'District', 'NI', 'Nisporeni' )
    ,( the_country_id, 'District', 'OC', 'Ocniþa' )
    ,( the_country_id, 'District', 'OR', 'Orhei' )
    ,( the_country_id, 'District', 'RE', 'Rezina' )
    ,( the_country_id, 'District', 'RI', 'Rîscani' )
    ,( the_country_id, 'District', 'SD', 'Soldanesti' )
    ,( the_country_id, 'District', 'SI', 'Sîngerei' )
    ,( the_country_id, 'Territorial unit', 'SN', 'Stînga Nistrului, unitatea teritoriala din' )
    ,( the_country_id, 'District', 'SO', 'Soroca' )
    ,( the_country_id, 'District', 'ST', 'Straseni' )
    ,( the_country_id, 'District', 'SV', 'Stefan Voda' )
    ,( the_country_id, 'District', 'TA', 'Taraclia' )
    ,( the_country_id, 'District', 'TE', 'Telenesti' )
    ,( the_country_id, 'District', 'UN', 'Ungheni' );
    
    -- Montenegro
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'ME' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Municipality', '01', 'Andrijevica' )
    ,( the_country_id, 'Municipality', '02', 'Bar' )
    ,( the_country_id, 'Municipality', '03', 'Berane' )
    ,( the_country_id, 'Municipality', '04', 'Bijelo Polje' )
    ,( the_country_id, 'Municipality', '05', 'Budva' )
    ,( the_country_id, 'Municipality', '06', 'Cetinje' )
    ,( the_country_id, 'Municipality', '07', 'Danilovgrad' )
    ,( the_country_id, 'Municipality', '08', 'Herceg-Novi' )
    ,( the_country_id, 'Municipality', '09', 'Kolašin' )
    ,( the_country_id, 'Municipality', '10', 'Kotor' )
    ,( the_country_id, 'Municipality', '11', 'Mojkovac' )
    ,( the_country_id, 'Municipality', '12', 'Nikšic´' )
    ,( the_country_id, 'Municipality', '13', 'Plav' )
    ,( the_country_id, 'Municipality', '14', 'Pljevlja' )
    ,( the_country_id, 'Municipality', '15', 'Plužine' )
    ,( the_country_id, 'Municipality', '16', 'Podgorica' )
    ,( the_country_id, 'Municipality', '17', 'Rožaje' )
    ,( the_country_id, 'Municipality', '18', 'Šavnik' )
    ,( the_country_id, 'Municipality', '19', 'Tivat' )
    ,( the_country_id, 'Municipality', '20', 'Ulcinj' )
    ,( the_country_id, 'Municipality', '21', 'Žabljak' )
    ,( the_country_id, 'Municipality', '22', 'Gusinje' )
    ,( the_country_id, 'Municipality', '23', 'Petnjica' );
    
    -- Madagascar
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MG' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'A', 'Toamasina' )
    ,( the_country_id, 'Province', 'D', 'Antsiranana' )
    ,( the_country_id, 'Province', 'F', 'Fianarantsoa' )
    ,( the_country_id, 'Province', 'M', 'Mahajanga' )
    ,( the_country_id, 'Province', 'T', 'Antananarivo' )
    ,( the_country_id, 'Province', 'U', 'Toliara' );
    
    -- Marshall Islands
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MH' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Municipality', 'ALK', 'Ailuk' )
    ,( the_country_id, 'Municipality', 'ALL', 'Ailinglapalap' )
    ,( the_country_id, 'Municipality', 'ARN', 'Arno' )
    ,( the_country_id, 'Municipality', 'AUR', 'Aur' )
    ,( the_country_id, 'Municipality', 'EBO', 'Ebon' )
    ,( the_country_id, 'Municipality', 'ENI', 'Enewetak and Ujelang' )
    ,( the_country_id, 'Municipality', 'JAB', 'Jabat' )
    ,( the_country_id, 'Municipality', 'JAL', 'Jaluit' )
    ,( the_country_id, 'Municipality', 'KIL', 'Bikini and Kili' )
    ,( the_country_id, 'Municipality', 'KWA', 'Kwajalein' )
    ,( the_country_id, 'Chains (of islands)', 'L', 'Ralik chain' )
    ,( the_country_id, 'Municipality', 'LAE', 'Lae' )
    ,( the_country_id, 'Municipality', 'LIB', 'Lib' )
    ,( the_country_id, 'Municipality', 'LIK', 'Likiep' )
    ,( the_country_id, 'Municipality', 'MAJ', 'Majuro' )
    ,( the_country_id, 'Municipality', 'MAL', 'Maloelap' )
    ,( the_country_id, 'Municipality', 'MEJ', 'Mejit' )
    ,( the_country_id, 'Municipality', 'MIL', 'Mili' )
    ,( the_country_id, 'Municipality', 'NMK', 'Namdrik' )
    ,( the_country_id, 'Municipality', 'NMU', 'Namu' )
    ,( the_country_id, 'Municipality', 'RON', 'Rongelap' )
    ,( the_country_id, 'Chains (of islands)', 'T', 'Ratak chain' )
    ,( the_country_id, 'Municipality', 'UJA', 'Ujae' )
    ,( the_country_id, 'Municipality', 'UTI', 'Utrik' )
    ,( the_country_id, 'Municipality', 'WTH', 'Wotho' )
    ,( the_country_id, 'Municipality', 'WTJ', 'Wotje' );
    
    -- Macedonia (the former Yugoslav Republic of)
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MK' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Municipality', '01', 'Aerodrom' )
    ,( the_country_id, 'Municipality', '02', 'Aracinovo' )
    ,( the_country_id, 'Municipality', '03', 'Berovo' )
    ,( the_country_id, 'Municipality', '04', 'Bitola' )
    ,( the_country_id, 'Municipality', '05', 'Bogdanci' )
    ,( the_country_id, 'Municipality', '06', 'Bogovinje' )
    ,( the_country_id, 'Municipality', '07', 'Bosilovo' )
    ,( the_country_id, 'Municipality', '08', 'Brvenica' )
    ,( the_country_id, 'Municipality', '09', 'Butel' )
    ,( the_country_id, 'Municipality', '10', 'Valandovo' )
    ,( the_country_id, 'Municipality', '11', 'Vasilevo' )
    ,( the_country_id, 'Municipality', '12', 'Vevcani' )
    ,( the_country_id, 'Municipality', '13', 'Veles' )
    ,( the_country_id, 'Municipality', '14', 'Vinica' )
    ,( the_country_id, 'Municipality', '15', 'Vraneštica' )
    ,( the_country_id, 'Municipality', '16', 'Vrapcište' )
    ,( the_country_id, 'Municipality', '17', 'Gazi Baba' )
    ,( the_country_id, 'Municipality', '18', 'Gevgelija' )
    ,( the_country_id, 'Municipality', '19', 'Gostivar' )
    ,( the_country_id, 'Municipality', '20', 'Gradsko' )
    ,( the_country_id, 'Municipality', '21', 'Debar' )
    ,( the_country_id, 'Municipality', '22', 'Debarca' )
    ,( the_country_id, 'Municipality', '23', 'Delcevo' )
    ,( the_country_id, 'Municipality', '24', 'Demir Kapija' )
    ,( the_country_id, 'Municipality', '25', 'Demir Hisar' )
    ,( the_country_id, 'Municipality', '26', 'Dojran' )
    ,( the_country_id, 'Municipality', '27', 'Dolneni' )
    ,( the_country_id, 'Municipality', '28', 'Drugovo' )
    ,( the_country_id, 'Municipality', '29', 'Gjorce Petrov' )
    ,( the_country_id, 'Municipality', '30', 'Želino' )
    ,( the_country_id, 'Municipality', '31', 'Zajas' )
    ,( the_country_id, 'Municipality', '32', 'Zelenikovo' )
    ,( the_country_id, 'Municipality', '33', 'Zrnovci' )
    ,( the_country_id, 'Municipality', '34', 'Ilinden' )
    ,( the_country_id, 'Municipality', '35', 'Jegunovce' )
    ,( the_country_id, 'Municipality', '36', 'Kavadarci' )
    ,( the_country_id, 'Municipality', '37', 'Karbinci' )
    ,( the_country_id, 'Municipality', '38', 'Karpoš' )
    ,( the_country_id, 'Municipality', '39', 'Kisela Voda' )
    ,( the_country_id, 'Municipality', '40', 'Kicevo' )
    ,( the_country_id, 'Municipality', '41', 'Konce' )
    ,( the_country_id, 'Municipality', '42', 'Kocani' )
    ,( the_country_id, 'Municipality', '43', 'Kratovo' )
    ,( the_country_id, 'Municipality', '44', 'Kriva Palanka' )
    ,( the_country_id, 'Municipality', '45', 'Krivogaštani' )
    ,( the_country_id, 'Municipality', '46', 'Kruševo' )
    ,( the_country_id, 'Municipality', '47', 'Kumanovo' )
    ,( the_country_id, 'Municipality', '48', 'Lipkovo' )
    ,( the_country_id, 'Municipality', '49', 'Lozovo' )
    ,( the_country_id, 'Municipality', '50', 'Mavrovo-i-Rostuša' )
    ,( the_country_id, 'Municipality', '51', 'Makedonska Kamenica' )
    ,( the_country_id, 'Municipality', '52', 'Makedonski Brod' )
    ,( the_country_id, 'Municipality', '53', 'Mogila' )
    ,( the_country_id, 'Municipality', '54', 'Negotino' )
    ,( the_country_id, 'Municipality', '55', 'Novaci' )
    ,( the_country_id, 'Municipality', '56', 'Novo Selo' )
    ,( the_country_id, 'Municipality', '57', 'Oslomej' )
    ,( the_country_id, 'Municipality', '58', 'Ohrid' )
    ,( the_country_id, 'Municipality', '59', 'Petrovec' )
    ,( the_country_id, 'Municipality', '60', 'Pehcevo' )
    ,( the_country_id, 'Municipality', '61', 'Plasnica' )
    ,( the_country_id, 'Municipality', '62', 'Prilep' )
    ,( the_country_id, 'Municipality', '63', 'Probištip' )
    ,( the_country_id, 'Municipality', '64', 'Radoviš' )
    ,( the_country_id, 'Municipality', '65', 'Rankovce' )
    ,( the_country_id, 'Municipality', '66', 'Resen' )
    ,( the_country_id, 'Municipality', '67', 'Rosoman' )
    ,( the_country_id, 'Municipality', '68', 'Saraj' )
    ,( the_country_id, 'Municipality', '69', 'Sveti Nikole' )
    ,( the_country_id, 'Municipality', '70', 'Sopište' )
    ,( the_country_id, 'Municipality', '71', 'Staro Nagoricane' )
    ,( the_country_id, 'Municipality', '72', 'Struga' )
    ,( the_country_id, 'Municipality', '73', 'Strumica' )
    ,( the_country_id, 'Municipality', '74', 'Studenicani' )
    ,( the_country_id, 'Municipality', '75', 'Tearce' )
    ,( the_country_id, 'Municipality', '76', 'Tetovo' )
    ,( the_country_id, 'Municipality', '77', 'Centar' )
    ,( the_country_id, 'Municipality', '78', 'Centar Župa' )
    ,( the_country_id, 'Municipality', '79', 'Cair' )
    ,( the_country_id, 'Municipality', '80', 'Caška' )
    ,( the_country_id, 'Municipality', '81', 'Cešinovo-Obleševo' )
    ,( the_country_id, 'Municipality', '82', 'Cucer Sandevo' )
    ,( the_country_id, 'Municipality', '83', 'Štip' )
    ,( the_country_id, 'Municipality', '84', 'Šuto Orizari' );
    
    -- Mali
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'ML' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', '1', 'Kayes' )
    ,( the_country_id, 'Region', '2', 'Koulikoro' )
    ,( the_country_id, 'Region', '3', 'Sikasso' )
    ,( the_country_id, 'Region', '4', 'Ségou' )
    ,( the_country_id, 'Region', '5', 'Mopti' )
    ,( the_country_id, 'Region', '6', 'Tombouctou' )
    ,( the_country_id, 'Region', '7', 'Gao' )
    ,( the_country_id, 'Region', '8', 'Kidal' )
    ,( the_country_id, 'District', 'BKO', 'Bamako' );
    
    -- Myanmar
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MM' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', '01', 'Sagaing' )
    ,( the_country_id, 'Region', '02', 'Bago' )
    ,( the_country_id, 'Region', '03', 'Magway' )
    ,( the_country_id, 'Region', '04', 'Mandalay' )
    ,( the_country_id, 'Region', '05', 'Taninthayi' )
    ,( the_country_id, 'Region', '06', 'Yangon' )
    ,( the_country_id, 'Region', '07', 'Ayeyawady' )
    ,( the_country_id, 'State', '11', 'Kachin' )
    ,( the_country_id, 'State', '12', 'Kayah' )
    ,( the_country_id, 'State', '13', 'Kayin' )
    ,( the_country_id, 'State', '14', 'Chin' )
    ,( the_country_id, 'State', '15', 'Mon' )
    ,( the_country_id, 'State', '16', 'Rakhine' )
    ,( the_country_id, 'State', '17', 'Shan' )
    ,( the_country_id, 'Union territory', '18', 'Nay Pyi Taw' );
    
    -- Mongolia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MN' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', '035', 'Orhon' )
    ,( the_country_id, 'Province', '037', 'Darhan uul' )
    ,( the_country_id, 'Province', '039', 'Hentiy' )
    ,( the_country_id, 'Province', '041', 'Hövagöl' )
    ,( the_country_id, 'Province', '043', 'Hovd' )
    ,( the_country_id, 'Province', '046', 'Uvs' )
    ,( the_country_id, 'Province', '047', 'Töv' )
    ,( the_country_id, 'Province', '049', 'Selenge' )
    ,( the_country_id, 'Province', '051', 'Sühbaatar' )
    ,( the_country_id, 'Province', '053', 'Ömnögovi' )
    ,( the_country_id, 'Province', '055', 'Övörhangay' )
    ,( the_country_id, 'Province', '057', 'Dzavhan' )
    ,( the_country_id, 'Province', '059', 'Dundgovi' )
    ,( the_country_id, 'Province', '061', 'Dornod' )
    ,( the_country_id, 'Province', '063', 'Dornogovi' )
    ,( the_country_id, 'Province', '064', 'Govi-Sümber' )
    ,( the_country_id, 'Province', '065', 'Govi-Altay' )
    ,( the_country_id, 'Province', '067', 'Bulgan' )
    ,( the_country_id, 'Province', '069', 'Bayanhongor' )
    ,( the_country_id, 'Province', '071', 'Bayan-Ölgiy' )
    ,( the_country_id, 'Province', '073', 'Arhangay' )
    ,( the_country_id, 'Capital city', '1', 'Ulaanbaatar' );
    
    -- Mauritania
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MR' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', '01', 'Hodh ech Chargui' )
    ,( the_country_id, 'Region', '02', 'Hodh el Gharbi' )
    ,( the_country_id, 'Region', '03', 'Assaba' )
    ,( the_country_id, 'Region', '04', 'Gorgol' )
    ,( the_country_id, 'Region', '05', 'Brakna' )
    ,( the_country_id, 'Region', '06', 'Trarza' )
    ,( the_country_id, 'Region', '07', 'Adrar' )
    ,( the_country_id, 'Region', '08', 'Dakhlet Nouâdhibou' )
    ,( the_country_id, 'Region', '09', 'Tagant' )
    ,( the_country_id, 'Region', '10', 'Guidimaka' )
    ,( the_country_id, 'Region', '11', 'Tiris Zemmour' )
    ,( the_country_id, 'Region', '12', 'Inchiri' )
    ,( the_country_id, 'District', 'NKC', 'Nouakchott' );
    
    -- Malta
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MT' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Local council', '01', 'Attard' )
    ,( the_country_id, 'Local council', '02', 'Balzan' )
    ,( the_country_id, 'Local council', '03', 'Birgu' )
    ,( the_country_id, 'Local council', '04', 'Birkirkara' )
    ,( the_country_id, 'Local council', '05', 'Birzebbuga' )
    ,( the_country_id, 'Local council', '06', 'Bormla' )
    ,( the_country_id, 'Local council', '07', 'Dingli' )
    ,( the_country_id, 'Local council', '08', 'Fgura' )
    ,( the_country_id, 'Local council', '09', 'Floriana' )
    ,( the_country_id, 'Local council', '10', 'Fontana' )
    ,( the_country_id, 'Local council', '11', 'Gudja' )
    ,( the_country_id, 'Local council', '12', 'Gzira' )
    ,( the_country_id, 'Local council', '13', 'Ghajnsielem' )
    ,( the_country_id, 'Local council', '14', 'Gharb' )
    ,( the_country_id, 'Local council', '15', 'Gharghur' )
    ,( the_country_id, 'Local council', '16', 'Ghasri' )
    ,( the_country_id, 'Local council', '17', 'Ghaxaq' )
    ,( the_country_id, 'Local council', '18', 'Hamrun' )
    ,( the_country_id, 'Local council', '19', 'Iklin' )
    ,( the_country_id, 'Local council', '20', 'Isla' )
    ,( the_country_id, 'Local council', '21', 'Kalkara' )
    ,( the_country_id, 'Local council', '22', 'Kercem' )
    ,( the_country_id, 'Local council', '23', 'Kirkop' )
    ,( the_country_id, 'Local council', '24', 'Lija' )
    ,( the_country_id, 'Local council', '25', 'Luqa' )
    ,( the_country_id, 'Local council', '26', 'Marsa' )
    ,( the_country_id, 'Local council', '27', 'Marsaskala' )
    ,( the_country_id, 'Local council', '28', 'Marsaxlokk' )
    ,( the_country_id, 'Local council', '29', 'Mdina' )
    ,( the_country_id, 'Local council', '30', 'Mellieha' )
    ,( the_country_id, 'Local council', '31', 'Mgarr' )
    ,( the_country_id, 'Local council', '32', 'Mosta' )
    ,( the_country_id, 'Local council', '33', 'Mqabba' )
    ,( the_country_id, 'Local council', '34', 'Msida' )
    ,( the_country_id, 'Local council', '35', 'Mtarfa' )
    ,( the_country_id, 'Local council', '36', 'Munxar' )
    ,( the_country_id, 'Local council', '37', 'Nadur' )
    ,( the_country_id, 'Local council', '38', 'Naxxar' )
    ,( the_country_id, 'Local council', '39', 'Paola' )
    ,( the_country_id, 'Local council', '40', 'Pembroke' )
    ,( the_country_id, 'Local council', '41', 'Pietà' )
    ,( the_country_id, 'Local council', '42', 'Qala' )
    ,( the_country_id, 'Local council', '43', 'Qormi' )
    ,( the_country_id, 'Local council', '44', 'Qrendi' )
    ,( the_country_id, 'Local council', '45', 'Rabat Gozo' )
    ,( the_country_id, 'Local council', '46', 'Rabat Malta' )
    ,( the_country_id, 'Local council', '47', 'Safi' )
    ,( the_country_id, 'Local council', '48', 'Saint Julian''s' )
    ,( the_country_id, 'Local council', '49', 'Saint John' )
    ,( the_country_id, 'Local council', '50', 'Saint Lawrence' )
    ,( the_country_id, 'Local council', '51', 'Saint Paul''s Bay' )
    ,( the_country_id, 'Local council', '52', 'Sannat' )
    ,( the_country_id, 'Local council', '53', 'Saint Lucia''s' )
    ,( the_country_id, 'Local council', '54', 'Santa Venera' )
    ,( the_country_id, 'Local council', '55', 'Siggiewi' )
    ,( the_country_id, 'Local council', '56', 'Sliema' )
    ,( the_country_id, 'Local council', '57', 'Swieqi' )
    ,( the_country_id, 'Local council', '58', 'Ta'' Xbiex' )
    ,( the_country_id, 'Local council', '59', 'Tarxien' )
    ,( the_country_id, 'Local council', '60', 'Valletta' )
    ,( the_country_id, 'Local council', '61', 'Xaghra' )
    ,( the_country_id, 'Local council', '62', 'Xewkija' )
    ,( the_country_id, 'Local council', '63', 'Xghajra' )
    ,( the_country_id, 'Local council', '64', 'Zabbar' )
    ,( the_country_id, 'Local council', '65', 'Zebbug Gozo' )
    ,( the_country_id, 'Local council', '66', 'Zebbug Malta' )
    ,( the_country_id, 'Local council', '67', 'Zejtun' )
    ,( the_country_id, 'Local council', '68', 'Zurrieq' );
    
    -- Mauritius
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MU' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Dependency', 'AG', 'Agalega Islands' )
    ,( the_country_id, 'District', 'BL', 'Black River' )
    ,( the_country_id, 'City', 'BR', 'Beau Bassin-Rose Hill' )
    ,( the_country_id, 'Dependency', 'CC', 'Cargados Carajos Shoals [Saint Brandon Islands]' )
    ,( the_country_id, 'City', 'CU', 'Curepipe' )
    ,( the_country_id, 'District', 'FL', 'Flacq' )
    ,( the_country_id, 'District', 'GP', 'Grand Port' )
    ,( the_country_id, 'District', 'MO', 'Moka' )
    ,( the_country_id, 'District', 'PA', 'Pamplemousses' )
    ,( the_country_id, 'District', 'PL', 'Port Louis' )
    ,( the_country_id, 'City', 'PU', 'Port Louis' )
    ,( the_country_id, 'District', 'PW', 'Plaines wilhems' )
    ,( the_country_id, 'City', 'QB', 'Quatre Bornes' )
    ,( the_country_id, 'Dependency', 'RO', 'Rodrigues Island' )
    ,( the_country_id, 'District', 'RR', 'Rivière du Rempart' )
    ,( the_country_id, 'District', 'SA', 'Savanne' )
    ,( the_country_id, 'City', 'VP', 'Vacoas-Phoenix' );
    
    -- Maldives
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MV' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Administrative atoll', '00', 'Alifu Dhaalu' )
    ,( the_country_id, 'Administrative atoll', '01', 'Seenu' )
    ,( the_country_id, 'Administrative atoll', '02', 'Alifu Alifu' )
    ,( the_country_id, 'Administrative atoll', '03', 'Lhaviyani' )
    ,( the_country_id, 'Administrative atoll', '04', 'Vaavu' )
    ,( the_country_id, 'Administrative atoll', '05', 'Laamu' )
    ,( the_country_id, 'Administrative atoll', '07', 'Haa Alif' )
    ,( the_country_id, 'Administrative atoll', '08', 'Thaa' )
    ,( the_country_id, 'Administrative atoll', '12', 'Meemu' )
    ,( the_country_id, 'Administrative atoll', '13', 'Raa' )
    ,( the_country_id, 'Administrative atoll', '14', 'Faafu' )
    ,( the_country_id, 'Administrative atoll', '17', 'Dhaalu' )
    ,( the_country_id, 'Administrative atoll', '20', 'Baa' )
    ,( the_country_id, 'Administrative atoll', '23', 'Haa Dhaalu' )
    ,( the_country_id, 'Administrative atoll', '24', 'Shaviyani' )
    ,( the_country_id, 'Administrative atoll', '25', 'Noonu' )
    ,( the_country_id, 'Administrative atoll', '26', 'Kaafu' )
    ,( the_country_id, 'Administrative atoll', '27', 'Gaafu Alifu' )
    ,( the_country_id, 'Administrative atoll', '28', 'Gaafu Dhaalu' )
    ,( the_country_id, 'Administrative atoll', '29', 'Gnaviyani' )
    ,( the_country_id, 'Province', 'CE', 'Medhu' )
    ,( the_country_id, 'Capital', 'MLE', 'Male' )
    ,( the_country_id, 'Province', 'NC', 'Medhu-Uthuru' )
    ,( the_country_id, 'Province', 'NO', 'Uthuru' )
    ,( the_country_id, 'Province', 'SC', 'Medhu-Dhekunu' )
    ,( the_country_id, 'Province', 'SU', 'Dhekunu' )
    ,( the_country_id, 'Province', 'UN', 'Mathi-Uthuru' )
    ,( the_country_id, 'Province', 'US', 'Mathi-Dhekunu' );
    
    -- Malawi
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MW' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', 'BA', 'Balaka' )
    ,( the_country_id, 'District', 'BL', 'Blantyre' )
    ,( the_country_id, 'Region', 'C', 'Central' )
    ,( the_country_id, 'District', 'CK', 'Chikwawa' )
    ,( the_country_id, 'District', 'CR', 'Chiradzulu' )
    ,( the_country_id, 'District', 'CT', 'Chitipa' )
    ,( the_country_id, 'District', 'DE', 'Dedza' )
    ,( the_country_id, 'District', 'DO', 'Dowa' )
    ,( the_country_id, 'District', 'KR', 'Karonga' )
    ,( the_country_id, 'District', 'KS', 'Kasungu' )
    ,( the_country_id, 'District', 'LI', 'Lilongwe' )
    ,( the_country_id, 'District', 'LK', 'Likoma' )
    ,( the_country_id, 'District', 'MC', 'Mchinji' )
    ,( the_country_id, 'District', 'MG', 'Mangochi' )
    ,( the_country_id, 'District', 'MH', 'Machinga' )
    ,( the_country_id, 'District', 'MU', 'Mulanje' )
    ,( the_country_id, 'District', 'MW', 'Mwanza' )
    ,( the_country_id, 'District', 'MZ', 'Mzimba' )
    ,( the_country_id, 'Region', 'N', 'Northern' )
    ,( the_country_id, 'District', 'NB', 'Nkhata Bay' )
    ,( the_country_id, 'District', 'NE', 'Neno' )
    ,( the_country_id, 'District', 'NI', 'Ntchisi' )
    ,( the_country_id, 'District', 'NK', 'Nkhotakota' )
    ,( the_country_id, 'District', 'NS', 'Nsanje' )
    ,( the_country_id, 'District', 'NU', 'Ntcheu' )
    ,( the_country_id, 'District', 'PH', 'Phalombe' )
    ,( the_country_id, 'District', 'RU', 'Rumphi' )
    ,( the_country_id, 'Region', 'S', 'Southern' )
    ,( the_country_id, 'District', 'SA', 'Salima' )
    ,( the_country_id, 'District', 'TH', 'Thyolo' )
    ,( the_country_id, 'District', 'ZO', 'Zomba' );
    
    -- Mexico
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MX' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'State', 'AGU', 'Aguascalientes' )
    ,( the_country_id, 'State', 'BCN', 'Baja California' )
    ,( the_country_id, 'State', 'BCS', 'Baja California Sur' )
    ,( the_country_id, 'State', 'CAM', 'Campeche' )
    ,( the_country_id, 'State', 'CHH', 'Chihuahua' )
    ,( the_country_id, 'State', 'CHP', 'Chiapas' )
    ,( the_country_id, 'State', 'COA', 'Coahuila' )
    ,( the_country_id, 'State', 'COL', 'Colima' )
    ,( the_country_id, 'Federal District', 'DIF', 'Distrito Federal' )
    ,( the_country_id, 'State', 'DUR', 'Durango' )
    ,( the_country_id, 'State', 'GRO', 'Guerrero' )
    ,( the_country_id, 'State', 'GUA', 'Guanajuato' )
    ,( the_country_id, 'State', 'HID', 'Hidalgo' )
    ,( the_country_id, 'State', 'JAL', 'Jalisco' )
    ,( the_country_id, 'State', 'MEX', 'México' )
    ,( the_country_id, 'State', 'MIC', 'Michoacán' )
    ,( the_country_id, 'State', 'MOR', 'Morelos' )
    ,( the_country_id, 'State', 'NAY', 'Nayarit' )
    ,( the_country_id, 'State', 'NLE', 'Nuevo León' )
    ,( the_country_id, 'State', 'OAX', 'Oaxaca' )
    ,( the_country_id, 'State', 'PUE', 'Puebla' )
    ,( the_country_id, 'State', 'QUE', 'Querétaro' )
    ,( the_country_id, 'State', 'ROO', 'Quintana Roo' )
    ,( the_country_id, 'State', 'SIN', 'Sinaloa' )
    ,( the_country_id, 'State', 'SLP', 'San Luis Potosí' )
    ,( the_country_id, 'State', 'SON', 'Sonora' )
    ,( the_country_id, 'State', 'TAB', 'Tabasco' )
    ,( the_country_id, 'State', 'TAM', 'Tamaulipas' )
    ,( the_country_id, 'State', 'TLA', 'Tlaxcala' )
    ,( the_country_id, 'State', 'VER', 'Veracruz' )
    ,( the_country_id, 'State', 'YUC', 'Yucatán' )
    ,( the_country_id, 'State', 'ZAC', 'Zacatecas' );
    
    -- Malaysia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MY' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'State', '01', 'Johor' )
    ,( the_country_id, 'State', '02', 'Kedah' )
    ,( the_country_id, 'State', '03', 'Kelantan' )
    ,( the_country_id, 'State', '04', 'Melaka' )
    ,( the_country_id, 'State', '05', 'Negeri Sembilan' )
    ,( the_country_id, 'State', '06', 'Pahang' )
    ,( the_country_id, 'State', '07', 'Pulau Pinang' )
    ,( the_country_id, 'State', '08', 'Perak' )
    ,( the_country_id, 'State', '09', 'Perlis' )
    ,( the_country_id, 'State', '10', 'Selangor' )
    ,( the_country_id, 'State', '11', 'Terengganu' )
    ,( the_country_id, 'State', '12', 'Sabah' )
    ,( the_country_id, 'State', '13', 'Sarawak' )
    ,( the_country_id, 'Federal territory', '14', 'Wilayah Persekutuan Kuala Lumpur' )
    ,( the_country_id, 'Federal territory', '15', 'Wilayah Persekutuan Labuan' )
    ,( the_country_id, 'Federal territory', '16', 'Wilayah Persekutuan Putrajaya' );
    
    -- Mozambique
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'MZ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'A', 'Niaosa' )
    ,( the_country_id, 'Province', 'B', 'Manica' )
    ,( the_country_id, 'Province', 'G', 'Gaza' )
    ,( the_country_id, 'Province', 'I', 'Inhambane' )
    ,( the_country_id, 'Province', 'L', 'Maputo' )
    ,( the_country_id, 'City', 'MPM', 'Maputo' )
    ,( the_country_id, 'Province', 'N', 'Nampula' )
    ,( the_country_id, 'Province', 'P', 'Cabo Delgado' )
    ,( the_country_id, 'Province', 'Q', 'Zambézia' )
    ,( the_country_id, 'Province', 'S', 'Sofala' )
    ,( the_country_id, 'Province', 'T', 'Tete' );
    
    -- Namibia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'NA' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'CA', 'Zambezi' )
    ,( the_country_id, 'Region', 'ER', 'Erongo' )
    ,( the_country_id, 'Region', 'HA', 'Hardap' )
    ,( the_country_id, 'Region', 'KA', 'Karas' )
    ,( the_country_id, 'Region', 'KE', 'Kavango East' )
    ,( the_country_id, 'Region', 'KH', 'Khomas' )
    ,( the_country_id, 'Region', 'KU', 'Kunene' )
    ,( the_country_id, 'Region', 'KW', 'Kavango West' )
    ,( the_country_id, 'Region', 'OD', 'Otjozondjupa' )
    ,( the_country_id, 'Region', 'OH', 'Omaheke' )
    ,( the_country_id, 'Region', 'ON', 'Oshana' )
    ,( the_country_id, 'Region', 'OS', 'Omusati' )
    ,( the_country_id, 'Region', 'OT', 'Oshikoto' )
    ,( the_country_id, 'Region', 'OW', 'Ohangwena' );
    
    -- Niger
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'NE' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', '1', 'Agadez' )
    ,( the_country_id, 'Region', '2', 'Diffa' )
    ,( the_country_id, 'Region', '3', 'Dosso' )
    ,( the_country_id, 'Region', '4', 'Maradi' )
    ,( the_country_id, 'Region', '5', 'Tahoua' )
    ,( the_country_id, 'Region', '6', 'Tillabéri' )
    ,( the_country_id, 'Region', '7', 'Zinder' )
    ,( the_country_id, 'Urban community', '8', 'Niamey' );
    
    -- Nigeria
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'NG' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'State', 'AB', 'Abia' )
    ,( the_country_id, 'State', 'AD', 'Adamawa' )
    ,( the_country_id, 'State', 'AK', 'Akwa Ibom' )
    ,( the_country_id, 'State', 'AN', 'Anambra' )
    ,( the_country_id, 'State', 'BA', 'Bauchi' )
    ,( the_country_id, 'State', 'BE', 'Benue' )
    ,( the_country_id, 'State', 'BO', 'Borno' )
    ,( the_country_id, 'State', 'BY', 'Bayelsa' )
    ,( the_country_id, 'State', 'CR', 'Cross River' )
    ,( the_country_id, 'State', 'DE', 'Delta' )
    ,( the_country_id, 'State', 'EB', 'Ebonyi' )
    ,( the_country_id, 'State', 'ED', 'Edo' )
    ,( the_country_id, 'State', 'EK', 'Ekiti' )
    ,( the_country_id, 'State', 'EN', 'Enugu' )
    ,( the_country_id, 'Capital territory', 'FC', 'Abuja Capital Territory' )
    ,( the_country_id, 'State', 'GO', 'Gombe' )
    ,( the_country_id, 'State', 'IM', 'Imo' )
    ,( the_country_id, 'State', 'JI', 'Jigawa' )
    ,( the_country_id, 'State', 'KD', 'Kaduna' )
    ,( the_country_id, 'State', 'KE', 'Kebbi' )
    ,( the_country_id, 'State', 'KN', 'Kano' )
    ,( the_country_id, 'State', 'KO', 'Kogi' )
    ,( the_country_id, 'State', 'KT', 'Katsina' )
    ,( the_country_id, 'State', 'KW', 'Kwara' )
    ,( the_country_id, 'State', 'LA', 'Lagos' )
    ,( the_country_id, 'State', 'NA', 'Nasarawa' )
    ,( the_country_id, 'State', 'NI', 'Niger' )
    ,( the_country_id, 'State', 'OG', 'Ogun' )
    ,( the_country_id, 'State', 'ON', 'Ondo' )
    ,( the_country_id, 'State', 'OS', 'Osun' )
    ,( the_country_id, 'State', 'OY', 'Oyo' )
    ,( the_country_id, 'State', 'PL', 'Plateau' )
    ,( the_country_id, 'State', 'RI', 'Rivers' )
    ,( the_country_id, 'State', 'SO', 'Sokoto' )
    ,( the_country_id, 'State', 'TA', 'Taraba' )
    ,( the_country_id, 'State', 'YO', 'Yobe' )
    ,( the_country_id, 'State', 'ZA', 'Zamfara' );
    
    -- Nicaragua
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'NI' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Autonomous region', 'AN', 'Atlántico Norte' )
    ,( the_country_id, 'Autonomous region', 'AS', 'Atlántico Sur' )
    ,( the_country_id, 'Department', 'BO', 'Boaco' )
    ,( the_country_id, 'Department', 'CA', 'Carazo' )
    ,( the_country_id, 'Department', 'CI', 'Chinandega' )
    ,( the_country_id, 'Department', 'CO', 'Chontales' )
    ,( the_country_id, 'Department', 'ES', 'Estelí' )
    ,( the_country_id, 'Department', 'GR', 'Granada' )
    ,( the_country_id, 'Department', 'JI', 'Jinotega' )
    ,( the_country_id, 'Department', 'LE', 'León' )
    ,( the_country_id, 'Department', 'MD', 'Madriz' )
    ,( the_country_id, 'Department', 'MN', 'Managua' )
    ,( the_country_id, 'Department', 'MS', 'Masaya' )
    ,( the_country_id, 'Department', 'MT', 'Matagalpa' )
    ,( the_country_id, 'Department', 'NS', 'Nueva Segovia' )
    ,( the_country_id, 'Department', 'RI', 'Rivas' )
    ,( the_country_id, 'Department', 'SJ', 'Río San Juan' );
    
    -- Netherlands
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'NL' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'DR', 'Drenthe' )
    ,( the_country_id, 'Province', 'FL', 'Flevoland' )
    ,( the_country_id, 'Province', 'FR', 'Fryslân' )
    ,( the_country_id, 'Province', 'GE', 'Gelderland' )
    ,( the_country_id, 'Province', 'GR', 'Groningen' )
    ,( the_country_id, 'Province', 'LI', 'Limburg' )
    ,( the_country_id, 'Province', 'NB', 'Noord-Brabant' )
    ,( the_country_id, 'Province', 'NH', 'Noord-Holland' )
    ,( the_country_id, 'Province', 'OV', 'Overijssel' )
    ,( the_country_id, 'Province', 'UT', 'Utrecht' )
    ,( the_country_id, 'Province', 'ZE', 'Zeeland' )
    ,( the_country_id, 'Province', 'ZH', 'Zuid-Holland' );
    
    -- Norway
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'NO' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'County', '01', 'Østfold' )
    ,( the_country_id, 'County', '02', 'Akershus' )
    ,( the_country_id, 'County', '03', 'Oslo' )
    ,( the_country_id, 'County', '04', 'Hedmark' )
    ,( the_country_id, 'County', '05', 'Oppland' )
    ,( the_country_id, 'County', '06', 'Buskerud' )
    ,( the_country_id, 'County', '07', 'Vestfold' )
    ,( the_country_id, 'County', '08', 'Telemark' )
    ,( the_country_id, 'County', '09', 'Aust-Agder' )
    ,( the_country_id, 'County', '10', 'Vest-Agder' )
    ,( the_country_id, 'County', '11', 'Rogaland' )
    ,( the_country_id, 'County', '12', 'Hordaland' )
    ,( the_country_id, 'County', '14', 'Sogn og Fjordane' )
    ,( the_country_id, 'County', '15', 'Møre og Romsdal' )
    ,( the_country_id, 'County', '16', 'Sør-Trøndelag' )
    ,( the_country_id, 'County', '17', 'Nord-Trøndelag' )
    ,( the_country_id, 'County', '18', 'Nordland' )
    ,( the_country_id, 'County', '19', 'Troms' )
    ,( the_country_id, 'County', '20', 'Finnmark' )
    ,( the_country_id, 'Arctic region', '21', 'Svalbard (Arctic Region)' )
    ,( the_country_id, 'Arctic region', '22', 'Jan Mayen (Arctic Region)' );
    
    -- Nepal
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'NP' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Zone', 'BA', 'Bagmati' )
    ,( the_country_id, 'Zone', 'BH', 'Bheri' )
    ,( the_country_id, 'Zone', 'DH', 'Dhawalagiri' )
    ,( the_country_id, 'Zone', 'GA', 'Gandaki' )
    ,( the_country_id, 'Zone', 'JA', 'Janakpur' )
    ,( the_country_id, 'Zone', 'KA', 'Karnali' )
    ,( the_country_id, 'Zone', 'KO', 'Kosi [Koshi]' )
    ,( the_country_id, 'Zone', 'LU', 'Lumbini' )
    ,( the_country_id, 'Zone', 'MA', 'Mahakali' )
    ,( the_country_id, 'Zone', 'ME', 'Mechi' )
    ,( the_country_id, 'Zone', 'NA', 'Narayani' )
    ,( the_country_id, 'Zone', 'RA', 'Rapti' )
    ,( the_country_id, 'Zone', 'SA', 'Sagarmatha' )
    ,( the_country_id, 'Zone', 'SE', 'Seti' );
    
    -- Nauru
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'NR' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', '01', 'Aiwo' )
    ,( the_country_id, 'District', '02', 'Anabar' )
    ,( the_country_id, 'District', '03', 'Anetan' )
    ,( the_country_id, 'District', '04', 'Anibare' )
    ,( the_country_id, 'District', '05', 'Baiti' )
    ,( the_country_id, 'District', '06', 'Boe' )
    ,( the_country_id, 'District', '07', 'Buada' )
    ,( the_country_id, 'District', '08', 'Denigomodu' )
    ,( the_country_id, 'District', '09', 'Ewa' )
    ,( the_country_id, 'District', '10', 'Ijuw' )
    ,( the_country_id, 'District', '11', 'Meneng' )
    ,( the_country_id, 'District', '12', 'Nibok' )
    ,( the_country_id, 'District', '13', 'Uaboe' )
    ,( the_country_id, 'District', '14', 'Yaren' );
    
    -- New Zealand
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'NZ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Unitary authority', 'AUK', 'Auckland' )
    ,( the_country_id, 'Region', 'BOP', 'Bay of Plenty' )
    ,( the_country_id, 'Region', 'CAN', 'Canterbury' )
    ,( the_country_id, 'Special Island Authorithy', 'CIT', 'Chatham Islands Territory' )
    ,( the_country_id, 'Unitary Authority', 'GIS', 'Gisborne District' )
    ,( the_country_id, 'Region', 'HKB', 'Hawkes''s Bay' )
    ,( the_country_id, 'Unitary Authority', 'MBH', 'Marlborough District' )
    ,( the_country_id, 'Region', 'MWT', 'Manawatu-Wanganui' )
    ,( the_country_id, 'Unitary Authority', 'NSN', 'Nelson City' )
    ,( the_country_id, 'Region', 'NTL', 'Northland' )
    ,( the_country_id, 'Region', 'OTA', 'Otago' )
    ,( the_country_id, 'Region', 'STL', 'Southland' )
    ,( the_country_id, 'Unitary Authority', 'TAS', 'Tasman District' )
    ,( the_country_id, 'Region', 'TKI', 'Taranaki' )
    ,( the_country_id, 'Region', 'WGN', 'Wellington' )
    ,( the_country_id, 'Region', 'WKO', 'Waikato' )
    ,( the_country_id, 'Region', 'WTC', 'West Coast' );
    
    -- Oman
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'OM' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'BA', 'Al Batinah' )
    ,( the_country_id, 'Governorate', 'BU', 'Al Buraymi' )
    ,( the_country_id, 'Region', 'DA', 'Ad Dakhiliyah' )
    ,( the_country_id, 'Governorate', 'MA', 'Masqat' )
    ,( the_country_id, 'Governorate', 'MU', 'Musandam' )
    ,( the_country_id, 'Region', 'SH', 'Ash Sharqiyah' )
    ,( the_country_id, 'Region', 'WU', 'AI Wusta' )
    ,( the_country_id, 'Region', 'ZA', 'Az Zahirah' )
    ,( the_country_id, 'Governorate', 'ZU', 'Z¸ufar' );
    
    -- Panama
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'PA' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', '1', 'Bocas del Toro' )
    ,( the_country_id, 'Province', '10', 'Panamá Oeste' )
    ,( the_country_id, 'Province', '2', 'Coclé' )
    ,( the_country_id, 'Province', '3', 'Colón' )
    ,( the_country_id, 'Province', '4', 'Chiriquí' )
    ,( the_country_id, 'Province', '5', 'Darién' )
    ,( the_country_id, 'Province', '6', 'Herrera' )
    ,( the_country_id, 'Province', '7', 'Los Santos' )
    ,( the_country_id, 'Province', '8', 'Panamá' )
    ,( the_country_id, 'Province', '9', 'Veraguas' )
    ,( the_country_id, 'indigenous region', 'EM', 'Emberá' )
    ,( the_country_id, 'indigenous region', 'KY', 'Kuna Yala' )
    ,( the_country_id, 'indigenous region', 'NB', 'Ngöbe-Buglé' );
    
    -- Peru
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'PE' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'AMA', 'Amazonas' )
    ,( the_country_id, 'Region', 'ANC', 'Ancash' )
    ,( the_country_id, 'Region', 'APU', 'Apurímac' )
    ,( the_country_id, 'Region', 'ARE', 'Arequipa' )
    ,( the_country_id, 'Region', 'AYA', 'Ayacucho' )
    ,( the_country_id, 'Region', 'CAJ', 'Cajamarca' )
    ,( the_country_id, 'Region', 'CAL', 'El Callao' )
    ,( the_country_id, 'Region', 'CUS', 'Cuzco [Cusco]' )
    ,( the_country_id, 'Region', 'HUC', 'Huánuco' )
    ,( the_country_id, 'Region', 'HUV', 'Huancavelica' )
    ,( the_country_id, 'Region', 'ICA', 'Ica' )
    ,( the_country_id, 'Region', 'JUN', 'Junín' )
    ,( the_country_id, 'Region', 'LAL', 'La Libertad' )
    ,( the_country_id, 'Region', 'LAM', 'Lambayeque' )
    ,( the_country_id, 'Region', 'LIM', 'Lima' )
    ,( the_country_id, 'Municipality', 'LMA', 'Lima hatun llaqta' )
    ,( the_country_id, 'Region', 'LOR', 'Loreto' )
    ,( the_country_id, 'Region', 'MDD', 'Madre de Dios' )
    ,( the_country_id, 'Region', 'MOQ', 'Moquegua' )
    ,( the_country_id, 'Region', 'PAS', 'Pasco' )
    ,( the_country_id, 'Region', 'PIU', 'Piura' )
    ,( the_country_id, 'Region', 'PUN', 'Puno' )
    ,( the_country_id, 'Region', 'SAM', 'San Martín' )
    ,( the_country_id, 'Region', 'TAC', 'Tacna' )
    ,( the_country_id, 'Region', 'TUM', 'Tumbes' )
    ,( the_country_id, 'Region', 'UCA', 'Ucayali' );
    
    -- Papua New Guinea
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'PG' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'CPK', 'Chimbu' )
    ,( the_country_id, 'Province', 'CPM', 'Central' )
    ,( the_country_id, 'Province', 'EBR', 'East New Britain' )
    ,( the_country_id, 'Province', 'EHG', 'Eastern Highlands' )
    ,( the_country_id, 'Province', 'EPW', 'Enga' )
    ,( the_country_id, 'Province', 'ESW', 'East Sepik' )
    ,( the_country_id, 'Province', 'GPK', 'Gulf' )
    ,( the_country_id, 'Province', 'HLA', 'Hela' )
    ,( the_country_id, 'Province', 'JWK', 'Jiwaka' )
    ,( the_country_id, 'Province', 'MBA', 'Milne Bay' )
    ,( the_country_id, 'Province', 'MPL', 'Morobe' )
    ,( the_country_id, 'Province', 'MPM', 'Madang' )
    ,( the_country_id, 'Province', 'MRL', 'Manus' )
    ,( the_country_id, 'District', 'NCD', 'National Capital District (Port Moresby)' )
    ,( the_country_id, 'Province', 'NIK', 'New Ireland' )
    ,( the_country_id, 'Province', 'NPP', 'Northern' )
    ,( the_country_id, 'autonomous region', 'NSB', 'Bougainville' )
    ,( the_country_id, 'Province', 'SAN', 'West Sepik' )
    ,( the_country_id, 'Province', 'SHM', 'Southern Highlands' )
    ,( the_country_id, 'Province', 'WBK', 'West New Britain' )
    ,( the_country_id, 'Province', 'WHM', 'Western Highlands' )
    ,( the_country_id, 'Province', 'WPD', 'Western' );
    
    -- Philippines
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'PH' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', '00', 'National Capital Région (Manila)' )
    ,( the_country_id, 'Province', 'ABR', 'Abra' )
    ,( the_country_id, 'Province', 'AGN', 'Agusan del Norte' )
    ,( the_country_id, 'Province', 'AGS', 'Agusan del Sur' )
    ,( the_country_id, 'Province', 'AKL', 'Aklan' )
    ,( the_country_id, 'Province', 'ALB', 'Albay' )
    ,( the_country_id, 'Province', 'ANT', 'Antique' )
    ,( the_country_id, 'Province', 'APA', 'Apayao' )
    ,( the_country_id, 'Province', 'AUR', 'Aurora' )
    ,( the_country_id, 'Province', 'BAN', 'Bataan' )
    ,( the_country_id, 'Province', 'BAS', 'Basilan' )
    ,( the_country_id, 'Province', 'BEN', 'Benguet' )
    ,( the_country_id, 'Province', 'BIL', 'Biliran' )
    ,( the_country_id, 'Province', 'BOH', 'Bohol' )
    ,( the_country_id, 'Province', 'BTG', 'Batangas' )
    ,( the_country_id, 'Province', 'BTN', 'Batanes' )
    ,( the_country_id, 'Province', 'BUK', 'Bukidnon' )
    ,( the_country_id, 'Province', 'BUL', 'Bulacan' )
    ,( the_country_id, 'Province', 'CAG', 'Cagayan' )
    ,( the_country_id, 'Province', 'CAM', 'Camiguin' )
    ,( the_country_id, 'Province', 'CAN', 'Camarines Norte' )
    ,( the_country_id, 'Province', 'CAP', 'Capiz' )
    ,( the_country_id, 'Province', 'CAS', 'Camarines Sur' )
    ,( the_country_id, 'Province', 'CAT', 'Catanduanes' )
    ,( the_country_id, 'Province', 'CAV', 'Cavite' )
    ,( the_country_id, 'Province', 'CEB', 'Cebu' )
    ,( the_country_id, 'Province', 'COM', 'Compostela Valley' )
    ,( the_country_id, 'Province', 'DAO', 'Davao Oriental' )
    ,( the_country_id, 'Province', 'DAS', 'Davao del Sur' )
    ,( the_country_id, 'Province', 'DAV', 'Davao del Norte' )
    ,( the_country_id, 'Province', 'DIN', 'Dinagat Islands' )
    ,( the_country_id, 'Province', 'EAS', 'Eastern Samar' )
    ,( the_country_id, 'Province', 'GUI', 'Guimaras' )
    ,( the_country_id, 'Province', 'IFU', 'Ifugao' )
    ,( the_country_id, 'Province', 'ILI', 'Iloilo' )
    ,( the_country_id, 'Province', 'ILN', 'Ilocos Norte' )
    ,( the_country_id, 'Province', 'ILS', 'Ilocos Sur' )
    ,( the_country_id, 'Province', 'ISA', 'Isabela' )
    ,( the_country_id, 'Province', 'KAL', 'Kalinga-Apayao' )
    ,( the_country_id, 'Province', 'LAG', 'Laguna' )
    ,( the_country_id, 'Province', 'LAN', 'Lanao del Norte' )
    ,( the_country_id, 'Province', 'LAS', 'Lanao del Sur' )
    ,( the_country_id, 'Province', 'LEY', 'Leyte' )
    ,( the_country_id, 'Province', 'LUN', 'La Union' )
    ,( the_country_id, 'Province', 'MAG', 'Maguindanao' )
    ,( the_country_id, 'Province', 'MAS', 'Masbate' )
    ,( the_country_id, 'Province', 'MDC', 'Mindoro Occidental' )
    ,( the_country_id, 'Province', 'MDR', 'Mindoro Oriental' )
    ,( the_country_id, 'Province', 'MOU', 'Mountain Province' )
    ,( the_country_id, 'Province', 'MSC', 'Misamis Occidental' )
    ,( the_country_id, 'Province', 'MSR', 'Misamis Oriental' )
    ,( the_country_id, 'Province', 'NCO', 'Kotabato' )
    ,( the_country_id, 'Province', 'NEC', 'Negros occidental' )
    ,( the_country_id, 'Province', 'NER', 'Negros oriental' )
    ,( the_country_id, 'Province', 'NSA', 'Northern Samar' )
    ,( the_country_id, 'Province', 'NUE', 'Nueva Ecija' )
    ,( the_country_id, 'Province', 'NUV', 'Nueva Vizcaya' )
    ,( the_country_id, 'Province', 'PAM', 'Pampanga' )
    ,( the_country_id, 'Province', 'PAN', 'Pangasinan' )
    ,( the_country_id, 'Province', 'PLW', 'Palawan' )
    ,( the_country_id, 'Province', 'QUE', 'Quezon' )
    ,( the_country_id, 'Province', 'QUI', 'Quirino' )
    ,( the_country_id, 'Province', 'RIZ', 'Rizal' )
    ,( the_country_id, 'Province', 'ROM', 'Romblon' )
    ,( the_country_id, 'Province', 'SAR', 'Sarangani' )
    ,( the_country_id, 'Province', 'SCO', 'South Cotabato' )
    ,( the_country_id, 'Province', 'SIG', 'Siquijor' )
    ,( the_country_id, 'Province', 'SLE', 'Southern Leyte' )
    ,( the_country_id, 'Province', 'SLU', 'Sulu' )
    ,( the_country_id, 'Province', 'SOR', 'Sorsogon' )
    ,( the_country_id, 'Province', 'SUK', 'Sultan Kudarat' )
    ,( the_country_id, 'Province', 'SUN', 'Surigao del Norte' )
    ,( the_country_id, 'Province', 'SUR', 'Surigao del Sur' )
    ,( the_country_id, 'Province', 'TAR', 'Tarlac' )
    ,( the_country_id, 'Province', 'TAW', 'Tawi-Tawi' )
    ,( the_country_id, 'Province', 'WSA', 'Western Samar' )
    ,( the_country_id, 'Province', 'ZAN', 'Zamboanga del Norte' )
    ,( the_country_id, 'Province', 'ZAS', 'Zamboanga del Sur' )
    ,( the_country_id, 'Province', 'ZMB', 'Zambales' )
    ,( the_country_id, 'Province', 'ZSI', 'Zamboanga Sibuguey [Zamboanga Sibugay]' );
    
    -- Pakistan
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'PK' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'BA', 'Balochistan' )
    ,( the_country_id, 'Pakistan administrered area', 'GB', 'Gilgit-Baltistan' )
    ,( the_country_id, 'Federal capital territory', 'IS', 'Islamabad' )
    ,( the_country_id, 'Pakistan administrered area', 'JK', 'Azad Kashmir' )
    ,( the_country_id, 'Province', 'KP', 'Khyber Pakhtunkhwa' )
    ,( the_country_id, 'Province', 'PB', 'Punjab' )
    ,( the_country_id, 'Province', 'SD', 'Sindh' )
    ,( the_country_id, 'Territory', 'TA', 'Federally Administered Tribal Areas' );
    
    -- Poland
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'PL' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'DS', 'Dolnoslaskie' )
    ,( the_country_id, 'Province', 'KP', 'Kujawsko-pomorskie' )
    ,( the_country_id, 'Province', 'LB', 'Lubuskie' )
    ,( the_country_id, 'Province', 'LD', 'Lódzkie' )
    ,( the_country_id, 'Province', 'LU', 'Lubelskie' )
    ,( the_country_id, 'Province', 'MA', 'Malopolskie' )
    ,( the_country_id, 'Province', 'MZ', 'Mazowieckie' )
    ,( the_country_id, 'Province', 'OP', 'Opolskie' )
    ,( the_country_id, 'Province', 'PD', 'Podlaskie' )
    ,( the_country_id, 'Province', 'PK', 'Podkarpackie' )
    ,( the_country_id, 'Province', 'PM', 'Pomorskie' )
    ,( the_country_id, 'Province', 'SK', 'Swietokrzyskie' )
    ,( the_country_id, 'Province', 'SL', 'Slaskie' )
    ,( the_country_id, 'Province', 'WN', 'Warminsko-mazurskie' )
    ,( the_country_id, 'Province', 'WP', 'Wielkopolskie' )
    ,( the_country_id, 'Province', 'ZP', 'Zachodniopomorskie' );
    
    -- Palestine, State of
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'PS' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Governorate', 'BTH', 'Bethlehem' )
    ,( the_country_id, 'Governorate', 'DEB', 'Deir El Balah' )
    ,( the_country_id, 'Governorate', 'GZA', 'Gaza' )
    ,( the_country_id, 'Governorate', 'HBN', 'Hebron' )
    ,( the_country_id, 'Governorate', 'JEM', 'Jerusalem' )
    ,( the_country_id, 'Governorate', 'JRH', 'Jericho – Al Aghwar' )
    ,( the_country_id, 'Governorate', 'KYS', 'Khan Yunis' )
    ,( the_country_id, 'Governorate', 'NBS', 'Nablus' )
    ,( the_country_id, 'Governorate', 'NGZ', 'North Gaza' )
    ,( the_country_id, 'Governorate', 'QQA', 'Qalqilya' )
    ,( the_country_id, 'Governorate', 'RBH', 'Ramallah' )
    ,( the_country_id, 'Governorate', 'RFH', 'Rafah' )
    ,( the_country_id, 'Governorate', 'SLT', 'Salfit' )
    ,( the_country_id, 'Governorate', 'TBS', 'Tubas' )
    ,( the_country_id, 'Governorate', 'TKM', 'Tulkarm' );
    
    -- Portugal
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'PT' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', '01', 'Aveiro' )
    ,( the_country_id, 'District', '02', 'Beja' )
    ,( the_country_id, 'District', '03', 'Braga' )
    ,( the_country_id, 'District', '04', 'Bragança' )
    ,( the_country_id, 'District', '05', 'Castelo Branco' )
    ,( the_country_id, 'District', '06', 'Coimbra' )
    ,( the_country_id, 'District', '07', 'Évora' )
    ,( the_country_id, 'District', '08', 'Faro' )
    ,( the_country_id, 'District', '09', 'Guarda' )
    ,( the_country_id, 'District', '10', 'Leiria' )
    ,( the_country_id, 'District', '11', 'Lisboa' )
    ,( the_country_id, 'District', '12', 'Portalegre' )
    ,( the_country_id, 'District', '13', 'Porto' )
    ,( the_country_id, 'District', '14', 'Santarém' )
    ,( the_country_id, 'District', '15', 'Setúbal' )
    ,( the_country_id, 'District', '16', 'Viana do Castelo' )
    ,( the_country_id, 'District', '17', 'Vila Real' )
    ,( the_country_id, 'District', '18', 'Viseu' )
    ,( the_country_id, 'Autonomous region', '20', 'Região Autónoma dos Açores' )
    ,( the_country_id, 'Autonomous region', '30', 'Região Autónoma da Madeira' );
    
    -- Palau
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'PW' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'State', '002', 'Aimeliik' )
    ,( the_country_id, 'State', '004', 'Airai' )
    ,( the_country_id, 'State', '010', 'Angaur' )
    ,( the_country_id, 'State', '050', 'Hatobohei' )
    ,( the_country_id, 'State', '100', 'Kayangel' )
    ,( the_country_id, 'State', '150', 'Koror' )
    ,( the_country_id, 'State', '212', 'Melekeok' )
    ,( the_country_id, 'State', '214', 'Ngaraard' )
    ,( the_country_id, 'State', '218', 'Ngarchelong' )
    ,( the_country_id, 'State', '222', 'Ngardmau' )
    ,( the_country_id, 'State', '224', 'Ngatpang' )
    ,( the_country_id, 'State', '226', 'Ngchesar' )
    ,( the_country_id, 'State', '227', 'Ngeremlengui' )
    ,( the_country_id, 'State', '228', 'Ngiwal' )
    ,( the_country_id, 'State', '350', 'Peleliu' )
    ,( the_country_id, 'State', '370', 'Sonsorol' );
    
    -- Paraguay
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'PY' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Department', '1', 'Concepción' )
    ,( the_country_id, 'Department', '10', 'Alto Paraná' )
    ,( the_country_id, 'Department', '11', 'Central' )
    ,( the_country_id, 'Department', '12', 'Ñeembucú' )
    ,( the_country_id, 'Department', '13', 'Amambay' )
    ,( the_country_id, 'Department', '14', 'Canindeyú' )
    ,( the_country_id, 'Department', '15', 'Presidente Hayes' )
    ,( the_country_id, 'Department', '16', 'Alto Paraguay' )
    ,( the_country_id, 'Department', '19', 'Boquerón' )
    ,( the_country_id, 'Department', '2', 'San Pedro' )
    ,( the_country_id, 'Department', '3', 'Cordillera' )
    ,( the_country_id, 'Department', '4', 'Guairá' )
    ,( the_country_id, 'Department', '5', 'Caaguazú' )
    ,( the_country_id, 'Department', '6', 'Caazapá' )
    ,( the_country_id, 'Department', '7', 'Itapúa' )
    ,( the_country_id, 'Department', '8', 'Misiones' )
    ,( the_country_id, 'Department', '9', 'Paraguarí' )
    ,( the_country_id, 'Capital', 'ASU', 'Asunción' );
    
    -- Qatar
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'QA' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Municipality', 'DA', 'Ad Dawhah' )
    ,( the_country_id, 'Municipality', 'KH', 'Al Khawr wa adh Dhakhirah' )
    ,( the_country_id, 'Municipality', 'MS', 'Ash Shamal' )
    ,( the_country_id, 'Municipality', 'RA', 'Ar Rayyan' )
    ,( the_country_id, 'Municipality', 'US', 'Umm Salal' )
    ,( the_country_id, 'Municipality', 'WA', 'Al Wakrah' )
    ,( the_country_id, 'Municipality', 'ZA', 'Az¸ Z¸a‘ayin' );
    
    -- Romania
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'RO' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Departments', 'AB', 'Alba' )
    ,( the_country_id, 'Departments', 'AG', 'Arges' )
    ,( the_country_id, 'Departments', 'AR', 'Arad' )
    ,( the_country_id, 'Municipality', 'B', 'Bucuresti' )
    ,( the_country_id, 'Departments', 'BC', 'Bacau' )
    ,( the_country_id, 'Departments', 'BH', 'Bihor' )
    ,( the_country_id, 'Departments', 'BN', 'Bistrita-Nasaud' )
    ,( the_country_id, 'Departments', 'BR', 'Braila' )
    ,( the_country_id, 'Departments', 'BT', 'Botosani' )
    ,( the_country_id, 'Departments', 'BV', 'Brasov' )
    ,( the_country_id, 'Departments', 'BZ', 'Buzau' )
    ,( the_country_id, 'Departments', 'CJ', 'Cluj' )
    ,( the_country_id, 'Departments', 'CL', 'Calarasi' )
    ,( the_country_id, 'Departments', 'CS', 'Caras-Severin' )
    ,( the_country_id, 'Departments', 'CT', 'Constarta' )
    ,( the_country_id, 'Departments', 'CV', 'Covasna' )
    ,( the_country_id, 'Departments', 'DB', 'Dâmbovita' )
    ,( the_country_id, 'Departments', 'DJ', 'Dolj' )
    ,( the_country_id, 'Departments', 'GJ', 'Gorj' )
    ,( the_country_id, 'Departments', 'GL', 'Galati' )
    ,( the_country_id, 'Departments', 'GR', 'Giurgiu' )
    ,( the_country_id, 'Departments', 'HD', 'Hunedoara' )
    ,( the_country_id, 'Departments', 'HR', 'Harghita' )
    ,( the_country_id, 'Departments', 'IF', 'Ilfov' )
    ,( the_country_id, 'Departments', 'IL', 'Ialomita' )
    ,( the_country_id, 'Departments', 'IS', 'Iasi' )
    ,( the_country_id, 'Departments', 'MH', 'Mehedinti' )
    ,( the_country_id, 'Departments', 'MM', 'Maramures' )
    ,( the_country_id, 'Departments', 'MS', 'Mures' )
    ,( the_country_id, 'Departments', 'NT', 'Neamt' )
    ,( the_country_id, 'Departments', 'OT', 'Olt' )
    ,( the_country_id, 'Departments', 'PH', 'Prahova' )
    ,( the_country_id, 'Departments', 'SB', 'Sibiu' )
    ,( the_country_id, 'Departments', 'SJ', 'Salaj' )
    ,( the_country_id, 'Departments', 'SM', 'Satu Mare' )
    ,( the_country_id, 'Departments', 'SV', 'Suceava' )
    ,( the_country_id, 'Departments', 'TL', 'Tulcea' )
    ,( the_country_id, 'Departments', 'TM', 'Timis' )
    ,( the_country_id, 'Departments', 'TR', 'Teleorman' )
    ,( the_country_id, 'Departments', 'VL', 'Vâlcea' )
    ,( the_country_id, 'Departments', 'VN', 'Vrancea' )
    ,( the_country_id, 'Departments', 'VS', 'Vaslui' );
    
    -- Serbia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'RS' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'City', '00', 'Beograd' )
    ,( the_country_id, 'District', '01', 'Severnobacki okrug' )
    ,( the_country_id, 'District', '02', 'Srednjebanatski okrug' )
    ,( the_country_id, 'District', '03', 'Severnobanatski okrug' )
    ,( the_country_id, 'District', '04', 'Južnobanatski okrug' )
    ,( the_country_id, 'District', '05', 'Zapadnobacki okrug' )
    ,( the_country_id, 'District', '06', 'Južnobacki okrug' )
    ,( the_country_id, 'District', '07', 'Sremski okrug' )
    ,( the_country_id, 'District', '08', 'Macvanski okrug' )
    ,( the_country_id, 'District', '09', 'Kolubarski okrug' )
    ,( the_country_id, 'District', '10', 'Podunavski okrug' )
    ,( the_country_id, 'District', '11', 'Branicevski okrug' )
    ,( the_country_id, 'District', '12', 'Šumadijski okrug' )
    ,( the_country_id, 'District', '13', 'Pomoravski okrug' )
    ,( the_country_id, 'District', '14', 'Borski okrug' )
    ,( the_country_id, 'District', '15', 'Zajecarski okrug' )
    ,( the_country_id, 'District', '16', 'Zlatiborski okrug' )
    ,( the_country_id, 'District', '17', 'Moravicki okrug' )
    ,( the_country_id, 'District', '18', 'Raški okrug' )
    ,( the_country_id, 'District', '19', 'Rasinski okrug' )
    ,( the_country_id, 'District', '20', 'Nišavski okrug' )
    ,( the_country_id, 'District', '21', 'Toplicki okrug' )
    ,( the_country_id, 'District', '22', 'Pirotski okrug' )
    ,( the_country_id, 'District', '23', 'Jablanicki okrug' )
    ,( the_country_id, 'District', '24', 'Pcinjski okrug' )
    ,( the_country_id, 'District', '25', 'Kosovski okrug' )
    ,( the_country_id, 'District', '26', 'Pecki okrug' )
    ,( the_country_id, 'District', '27', 'Prizrenski okrug' )
    ,( the_country_id, 'District', '28', 'Kosovsko-Mitrovacki okrug' )
    ,( the_country_id, 'District', '29', 'Kosovsko-Pomoravski okrug' )
    ,( the_country_id, 'Autonomous province', 'KM', 'Kosovo-Metohija' )
    ,( the_country_id, 'Autonomous province', 'VO', 'Vojvodina' );
    
    -- Russian Federation
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'RU' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Republic', 'AD', 'Adygeya, Respublika' )
    ,( the_country_id, 'Republic', 'AL', 'Altay, Respublika' )
    ,( the_country_id, 'Administrative territory', 'ALT', 'Altayskiy kray' )
    ,( the_country_id, 'Administrative region', 'AMU', 'Amurskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'ARK', 'Arkhangel''skaya oblast''' )
    ,( the_country_id, 'Administrative region', 'AST', 'Astrakhanskaya oblast''' )
    ,( the_country_id, 'Republic', 'BA', 'Bashkortostan, Respublika' )
    ,( the_country_id, 'Administrative region', 'BEL', 'Belgorodskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'BRY', 'Bryanskaya oblast''' )
    ,( the_country_id, 'Republic', 'BU', 'Buryatiya, Respublika' )
    ,( the_country_id, 'Republic', 'CE', 'Chechenskaya Respublika' )
    ,( the_country_id, 'Administrative region', 'CHE', 'Chelyabinskaya oblast''' )
    ,( the_country_id, 'Autonomous district', 'CHU', 'Chukotskiy avtonomnyy okrug' )
    ,( the_country_id, 'Republic', 'CU', 'Chuvashskaya Respublika' )
    ,( the_country_id, 'Republic', 'DA', 'Dagestan, Respublika' )
    ,( the_country_id, 'Republic', 'IN', 'Ingushskaya Respublika [Respublika Ingushetiya]' )
    ,( the_country_id, 'Administrative region', 'IRK', 'Irkutskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'IVA', 'Ivanovskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'KAM', 'Kamchatskaya oblast''' )
    ,( the_country_id, 'Republic', 'KB', 'Kabardino-Balkarskaya Respublika' )
    ,( the_country_id, 'Republic', 'KC', 'Karachayevo-Cherkesskaya Respublika' )
    ,( the_country_id, 'Administrative territory', 'KDA', 'Krasnodarskiy kray' )
    ,( the_country_id, 'Administrative region', 'KEM', 'Kemerovskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'KGD', 'Kaliningradskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'KGN', 'Kurganskaya oblast''' )
    ,( the_country_id, 'Administrative territory', 'KHA', 'Khabarovskiy kray' )
    ,( the_country_id, 'Autonomous district', 'KHM', 'Khanty-Mansiyskiy avtonomnyy okrug' )
    ,( the_country_id, 'Administrative region', 'KIR', 'Kirovskaya oblast''' )
    ,( the_country_id, 'Republic', 'KK', 'Khakasiya, Respublika' )
    ,( the_country_id, 'Republic', 'KL', 'Kalmykiya, Respublika' )
    ,( the_country_id, 'Administrative region', 'KLU', 'Kaluzhskaya oblast''' )
    ,( the_country_id, 'Republic', 'KO', 'Komi, Respublika' )
    ,( the_country_id, 'Administrative region', 'KOS', 'Kostromskaya oblast''' )
    ,( the_country_id, 'Republic', 'KR', 'Kareliya, Respublika' )
    ,( the_country_id, 'Administrative region', 'KRS', 'Kurskaya oblast''' )
    ,( the_country_id, 'Administrative territory', 'KYA', 'Krasnoyarskiy kray' )
    ,( the_country_id, 'Administrative region', 'LEN', 'Leningradskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'LIP', 'Lipetskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'MAG', 'Magadanskaya oblast''' )
    ,( the_country_id, 'Republic', 'ME', 'Mariy El, Respublika' )
    ,( the_country_id, 'Republic', 'MO', 'Mordoviya, Respublika' )
    ,( the_country_id, 'Administrative region', 'MOS', 'Moskovskaya oblast''' )
    ,( the_country_id, 'Autonomous city', 'MOW', 'Moskva' )
    ,( the_country_id, 'Administrative region', 'MUR', 'Murmanskaya oblast''' )
    ,( the_country_id, 'Autonomous district', 'NEN', 'Nenetskiy avtonomnyy okrug' )
    ,( the_country_id, 'Administrative region', 'NGR', 'Novgorodskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'NIZ', 'Nizhegorodskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'NVS', 'Novosibirskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'OMS', 'Omskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'ORE', 'Orenburgskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'ORL', 'Orlovskaya oblast''' )
    ,( the_country_id, 'Administrative territory', 'PER', 'Perm' )
    ,( the_country_id, 'Administrative region', 'PNZ', 'Penzenskaya oblast''' )
    ,( the_country_id, 'Administrative territory', 'PRI', 'Primorskiy kray' )
    ,( the_country_id, 'Administrative region', 'PSK', 'Pskovskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'ROS', 'Rostovskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'RYA', 'Ryazanskaya oblast''' )
    ,( the_country_id, 'Republic', 'SA', 'Sakha, Respublika [Yakutiya]' )
    ,( the_country_id, 'Administrative region', 'SAK', 'Sakhalinskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'SAM', 'Samarskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'SAR', 'Saratovskaya oblast''' )
    ,( the_country_id, 'Republic', 'SE', 'Severnaya Osetiya, Respublika Alaniya] [Respublika Severnaya Osetiya-Alaniya]' )
    ,( the_country_id, 'Administrative region', 'SMO', 'Smolenskaya oblast''' )
    ,( the_country_id, 'Autonomous city', 'SPE', 'Sankt-Peterburg' )
    ,( the_country_id, 'Administrative territory', 'STA', 'Stavropol''skiy kray' )
    ,( the_country_id, 'Administrative region', 'SVE', 'Sverdlovskaya oblast''' )
    ,( the_country_id, 'Republic', 'TA', 'Tatarstan, Respublika' )
    ,( the_country_id, 'Administrative region', 'TAM', 'Tambovskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'TOM', 'Tomskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'TUL', 'Tul''skaya oblast''' )
    ,( the_country_id, 'Administrative region', 'TVE', 'Tverskaya oblast''' )
    ,( the_country_id, 'Republic', 'TY', 'Tyva, Respublika [Tuva]' )
    ,( the_country_id, 'Administrative region', 'TYU', 'Tyumenskaya oblast''' )
    ,( the_country_id, 'Republic', 'UD', 'Udmurtskaya Respublika' )
    ,( the_country_id, 'Administrative region', 'ULY', 'Ul''yanovskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'VGG', 'Volgogradskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'VLA', 'Vladimirskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'VLG', 'Vologodskaya oblast''' )
    ,( the_country_id, 'Administrative region', 'VOR', 'Voronezhskaya oblast''' )
    ,( the_country_id, 'Autonomous district', 'YAN', 'Yamalo-Nenetskiy avtonomnyy okrug' )
    ,( the_country_id, 'Administrative region', 'YAR', 'Yaroslavskaya oblast''' )
    ,( the_country_id, 'Autonomous region', 'YEV', 'Yevreyskaya avtonomnaya oblast''' )
    ,( the_country_id, 'Administrative territory', 'ZAB', 'Zabaykal''skiy kray' );
    
    -- Rwanda
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'RW' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Town council', '01', 'Ville de Kigali' )
    ,( the_country_id, 'Province', '02', 'Est' )
    ,( the_country_id, 'Province', '03', 'Nord' )
    ,( the_country_id, 'Province', '04', 'Ouest' )
    ,( the_country_id, 'Province', '05', 'Sud' );
    
    -- Saudi Arabia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SA' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', '01', 'Ar Riyad' )
    ,( the_country_id, 'Province', '02', 'Makkah al Mukarramah' )
    ,( the_country_id, 'Province', '03', 'Al Madinah al Munawwarah' )
    ,( the_country_id, 'Province', '04', 'Ash Sharqiyah' )
    ,( the_country_id, 'Province', '05', 'AI Qasim' )
    ,( the_country_id, 'Province', '06', 'Ha''il' )
    ,( the_country_id, 'Province', '07', 'Tabuk' )
    ,( the_country_id, 'Province', '08', 'AI Hudud ash Shamaliyah' )
    ,( the_country_id, 'Province', '09', 'Jazan' )
    ,( the_country_id, 'Province', '10', 'Najran' )
    ,( the_country_id, 'Province', '11', 'AI Bahah' )
    ,( the_country_id, 'Province', '12', 'AI Jawf' )
    ,( the_country_id, 'Province', '14', '''Asir' );
    
    -- Solomon Islands
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SB' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'CE', 'Central' )
    ,( the_country_id, 'Province', 'CH', 'Choiseul' )
    ,( the_country_id, 'Capital territory', 'CT', 'Capital Territory (Honiara)' )
    ,( the_country_id, 'Province', 'GU', 'Guadalcanal' )
    ,( the_country_id, 'Province', 'IS', 'Isabel' )
    ,( the_country_id, 'Province', 'MK', 'Makira-Ulawa' )
    ,( the_country_id, 'Province', 'ML', 'Malaita' )
    ,( the_country_id, 'Province', 'RB', 'Rennell and Bellona' )
    ,( the_country_id, 'Province', 'TE', 'Temotu' )
    ,( the_country_id, 'Province', 'WE', 'Western' );
    
    -- Seychelles
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SC' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', '01', 'Anse aux Pins' )
    ,( the_country_id, 'District', '02', 'Anse Boileau' )
    ,( the_country_id, 'District', '03', 'Anse Étoile' )
    ,( the_country_id, 'District', '04', 'Au Cap' )
    ,( the_country_id, 'District', '05', 'Anse Royale' )
    ,( the_country_id, 'District', '06', 'Baie Lazare' )
    ,( the_country_id, 'District', '07', 'Baie Sainte Anne' )
    ,( the_country_id, 'District', '08', 'Beau Vallon' )
    ,( the_country_id, 'District', '09', 'Bel Air' )
    ,( the_country_id, 'District', '10', 'Bel Ombre' )
    ,( the_country_id, 'District', '11', 'Cascade' )
    ,( the_country_id, 'District', '12', 'Glacis' )
    ,( the_country_id, 'District', '13', 'Grand''Anse Mahé' )
    ,( the_country_id, 'District', '14', 'Grand''Anse Praslin' )
    ,( the_country_id, 'District', '15', 'La Digue' )
    ,( the_country_id, 'District', '16', 'La Rivière Anglaise' )
    ,( the_country_id, 'District', '17', 'Mont Buxton' )
    ,( the_country_id, 'District', '18', 'Mont Fleuri' )
    ,( the_country_id, 'District', '19', 'Plaisance' )
    ,( the_country_id, 'District', '20', 'Pointe La Rue' )
    ,( the_country_id, 'District', '21', 'Port Glaud' )
    ,( the_country_id, 'District', '22', 'Saint Louis' )
    ,( the_country_id, 'District', '23', 'Takamaka' )
    ,( the_country_id, 'District', '24', 'Lemamel' )
    ,( the_country_id, 'District', '25', 'Ros Kaiman' );
    
    -- Sudan
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SD' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'State', 'DC', 'Zalingei' )
    ,( the_country_id, 'State', 'DE', 'Sharq Darfur' )
    ,( the_country_id, 'State', 'DN', 'Shamal Darfur' )
    ,( the_country_id, 'State', 'DS', 'Janub Darfur' )
    ,( the_country_id, 'State', 'DW', 'Gharb Darfur' )
    ,( the_country_id, 'State', 'GD', 'Al Qadarif' )
    ,( the_country_id, 'State', 'GZ', 'Al Jazirah' )
    ,( the_country_id, 'State', 'KA', 'Kassala' )
    ,( the_country_id, 'State', 'KH', 'Al Khartum' )
    ,( the_country_id, 'State', 'KN', 'Shamal Kurdufan' )
    ,( the_country_id, 'State', 'KS', 'Janub Kurdufan' )
    ,( the_country_id, 'State', 'NB', 'An Nil al Azraq' )
    ,( the_country_id, 'State', 'NO', 'Ash Shamaliyah' )
    ,( the_country_id, 'State', 'NR', 'An Nil' )
    ,( the_country_id, 'State', 'NW', 'An Nīl al Abyaḑ' )
    ,( the_country_id, 'State', 'RS', 'Al Baḩr al Aḩmar' )
    ,( the_country_id, 'State', 'SI', 'Sinnar' );
    
    -- Sweden
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SE' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'County', 'AB', 'Stockholms län' )
    ,( the_country_id, 'County', 'AC', 'Västerbottens län' )
    ,( the_country_id, 'County', 'BD', 'Norrbottens län' )
    ,( the_country_id, 'County', 'C', 'Uppsala län' )
    ,( the_country_id, 'County', 'D', 'Södermanlands län' )
    ,( the_country_id, 'County', 'E', 'Östergötlands län' )
    ,( the_country_id, 'County', 'F', 'Jönköpings län' )
    ,( the_country_id, 'County', 'G', 'Kronoborgs län' )
    ,( the_country_id, 'County', 'H', 'Kalmar län' )
    ,( the_country_id, 'County', 'I', 'Gotlands län' )
    ,( the_country_id, 'County', 'K', 'Blekinge län' )
    ,( the_country_id, 'County', 'M', 'Skåne län' )
    ,( the_country_id, 'County', 'N', 'Hallands län' )
    ,( the_country_id, 'County', 'O', 'Västra Götalands län' )
    ,( the_country_id, 'County', 'S', 'Värmlands län' )
    ,( the_country_id, 'County', 'T', 'Örebro län' )
    ,( the_country_id, 'County', 'U', 'Västmanlands län' )
    ,( the_country_id, 'County', 'W', 'Dalarnes län' )
    ,( the_country_id, 'County', 'X', 'Gävleborgs län' )
    ,( the_country_id, 'County', 'Y', 'Västernorrlands län' )
    ,( the_country_id, 'County', 'Z', 'Jämtlands län' );
    
    -- Singapore
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SG' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', '01', 'Central Singapore' )
    ,( the_country_id, 'District', '02', 'North East' )
    ,( the_country_id, 'District', '03', 'North West' )
    ,( the_country_id, 'District', '04', 'South East' )
    ,( the_country_id, 'District', '05', 'South West' );
    
    -- Saint Helena, Ascension and Tristan da Cunha
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SH' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Geographical entity', 'AC', 'Ascension' )
    ,( the_country_id, 'Geographical entity', 'HL', 'Saint Helena' )
    ,( the_country_id, 'Geographical entity', 'TA', 'Tristan da Cunha' );
    
    -- Slovenia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SI' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Commune', '001', 'Ajdovšcina' )
    ,( the_country_id, 'Commune', '002', 'Beltinci' )
    ,( the_country_id, 'Commune', '003', 'Bled' )
    ,( the_country_id, 'Commune', '004', 'Bohinj' )
    ,( the_country_id, 'Commune', '005', 'Borovnica' )
    ,( the_country_id, 'Commune', '006', 'Bovec' )
    ,( the_country_id, 'Commune', '007', 'Brda' )
    ,( the_country_id, 'Commune', '008', 'Brezovica' )
    ,( the_country_id, 'Commune', '009', 'Brežice' )
    ,( the_country_id, 'Commune', '010', 'Tišina' )
    ,( the_country_id, 'Commune', '011', 'Celje' )
    ,( the_country_id, 'Commune', '012', 'Cerklje na Gorenjskem' )
    ,( the_country_id, 'Commune', '013', 'Cerknica' )
    ,( the_country_id, 'Commune', '014', 'Cerkno' )
    ,( the_country_id, 'Commune', '015', 'Crenšovci' )
    ,( the_country_id, 'Commune', '016', 'Crna na Koroškem' )
    ,( the_country_id, 'Commune', '017', 'Crnomelj' )
    ,( the_country_id, 'Commune', '018', 'Destrnik' )
    ,( the_country_id, 'Commune', '019', 'Divaca' )
    ,( the_country_id, 'Commune', '020', 'Dobrepolje' )
    ,( the_country_id, 'Commune', '021', 'Dobrova-Polhov Gradec' )
    ,( the_country_id, 'Commune', '022', 'Dol pri Ljubljani' )
    ,( the_country_id, 'Commune', '023', 'Domžale' )
    ,( the_country_id, 'Commune', '024', 'Dornava' )
    ,( the_country_id, 'Commune', '025', 'Dravograd' )
    ,( the_country_id, 'Commune', '026', 'Duplek' )
    ,( the_country_id, 'Commune', '027', 'Gorenja vas-Poljane' )
    ,( the_country_id, 'Commune', '028', 'Gorišnica' )
    ,( the_country_id, 'Commune', '029', 'Gornja Radgona' )
    ,( the_country_id, 'Commune', '030', 'Gornji Grad' )
    ,( the_country_id, 'Commune', '031', 'Gornji Petrovci' )
    ,( the_country_id, 'Commune', '032', 'Grosuplje' )
    ,( the_country_id, 'Commune', '033', 'Šalovci' )
    ,( the_country_id, 'Commune', '034', 'Hrastnik' )
    ,( the_country_id, 'Commune', '035', 'Hrpelje-Kozina' )
    ,( the_country_id, 'Commune', '036', 'Idrija' )
    ,( the_country_id, 'Commune', '037', 'Ig' )
    ,( the_country_id, 'Commune', '038', 'Ilirska Bistrica' )
    ,( the_country_id, 'Commune', '039', 'Ivancna Gorica' )
    ,( the_country_id, 'Commune', '040', 'Izola' )
    ,( the_country_id, 'Commune', '041', 'Jesenice' )
    ,( the_country_id, 'Commune', '042', 'Juršinci' )
    ,( the_country_id, 'Commune', '043', 'Kamnik' )
    ,( the_country_id, 'Commune', '044', 'Kanal' )
    ,( the_country_id, 'Commune', '045', 'Kidricevo' )
    ,( the_country_id, 'Commune', '046', 'Kobarid' )
    ,( the_country_id, 'Commune', '047', 'Kobilje' )
    ,( the_country_id, 'Commune', '048', 'Kocevje' )
    ,( the_country_id, 'Commune', '049', 'Komen' )
    ,( the_country_id, 'Commune', '050', 'Koper' )
    ,( the_country_id, 'Commune', '051', 'Kozje' )
    ,( the_country_id, 'Commune', '052', 'Kranj' )
    ,( the_country_id, 'Commune', '053', 'Kranjska Gora' )
    ,( the_country_id, 'Commune', '054', 'Krško' )
    ,( the_country_id, 'Commune', '055', 'Kungota' )
    ,( the_country_id, 'Commune', '056', 'Kuzma' )
    ,( the_country_id, 'Commune', '057', 'Laško' )
    ,( the_country_id, 'Commune', '058', 'Lenart' )
    ,( the_country_id, 'Commune', '059', 'Lendava' )
    ,( the_country_id, 'Commune', '060', 'Litija' )
    ,( the_country_id, 'Commune', '061', 'Ljubljana' )
    ,( the_country_id, 'Commune', '062', 'Ljubno' )
    ,( the_country_id, 'Commune', '063', 'Ljutomer' )
    ,( the_country_id, 'Commune', '064', 'Logatec' )
    ,( the_country_id, 'Commune', '065', 'Loška dolina' )
    ,( the_country_id, 'Commune', '066', 'Loški Potok' )
    ,( the_country_id, 'Commune', '067', 'Luce' )
    ,( the_country_id, 'Commune', '068', 'Lukovica' )
    ,( the_country_id, 'Commune', '069', 'Majšperk' )
    ,( the_country_id, 'Commune', '070', 'Maribor' )
    ,( the_country_id, 'Commune', '071', 'Medvode' )
    ,( the_country_id, 'Commune', '072', 'Mengeš' )
    ,( the_country_id, 'Commune', '073', 'Metlika' )
    ,( the_country_id, 'Commune', '074', 'Mežica' )
    ,( the_country_id, 'Commune', '075', 'Miren-Kostanjevica' )
    ,( the_country_id, 'Commune', '076', 'Mislinja' )
    ,( the_country_id, 'Commune', '077', 'Moravce' )
    ,( the_country_id, 'Commune', '078', 'Moravske Toplice' )
    ,( the_country_id, 'Commune', '079', 'Mozirje' )
    ,( the_country_id, 'Commune', '080', 'Murska Sobota' )
    ,( the_country_id, 'Commune', '081', 'Muta' )
    ,( the_country_id, 'Commune', '082', 'Naklo' )
    ,( the_country_id, 'Commune', '083', 'Nazarje' )
    ,( the_country_id, 'Commune', '084', 'Nova Gorica' )
    ,( the_country_id, 'Commune', '085', 'Novo mesto' )
    ,( the_country_id, 'Commune', '086', 'Odranci' )
    ,( the_country_id, 'Commune', '087', 'Ormož' )
    ,( the_country_id, 'Commune', '088', 'Osilnica' )
    ,( the_country_id, 'Commune', '089', 'Pesnica' )
    ,( the_country_id, 'Commune', '090', 'Piran' )
    ,( the_country_id, 'Commune', '091', 'Pivka' )
    ,( the_country_id, 'Commune', '092', 'Podcetrtek' )
    ,( the_country_id, 'Commune', '093', 'Podvelka' )
    ,( the_country_id, 'Commune', '094', 'Postojna' )
    ,( the_country_id, 'Commune', '095', 'Preddvor' )
    ,( the_country_id, 'Commune', '096', 'Ptuj' )
    ,( the_country_id, 'Commune', '097', 'Puconci' )
    ,( the_country_id, 'Commune', '098', 'Race-Fram' )
    ,( the_country_id, 'Commune', '099', 'Radece' )
    ,( the_country_id, 'Commune', '100', 'Radenci' )
    ,( the_country_id, 'Commune', '101', 'Radlje ob Dravi' )
    ,( the_country_id, 'Commune', '102', 'Radovljica' )
    ,( the_country_id, 'Commune', '103', 'Ravne na Koroškem' )
    ,( the_country_id, 'Commune', '104', 'Ribnica' )
    ,( the_country_id, 'Commune', '105', 'Rogašovci' )
    ,( the_country_id, 'Commune', '106', 'Rogaška Slatina' )
    ,( the_country_id, 'Commune', '107', 'Rogatec' )
    ,( the_country_id, 'Commune', '108', 'Ruše' )
    ,( the_country_id, 'Commune', '109', 'Semic' )
    ,( the_country_id, 'Commune', '110', 'Sevnica' )
    ,( the_country_id, 'Commune', '111', 'Sežana' )
    ,( the_country_id, 'Commune', '112', 'Slovenj Gradec' )
    ,( the_country_id, 'Commune', '113', 'Slovenska Bistrica' )
    ,( the_country_id, 'Commune', '114', 'Slovenske Konjice' )
    ,( the_country_id, 'Commune', '115', 'Starše' )
    ,( the_country_id, 'Commune', '116', 'Sveti Jurij' )
    ,( the_country_id, 'Commune', '117', 'Šencur' )
    ,( the_country_id, 'Commune', '118', 'Šentilj' )
    ,( the_country_id, 'Commune', '119', 'Šentjernej' )
    ,( the_country_id, 'Commune', '120', 'Šentjur' )
    ,( the_country_id, 'Commune', '121', 'Škocjan' )
    ,( the_country_id, 'Commune', '122', 'Škofja Loka' )
    ,( the_country_id, 'Commune', '123', 'Škofljica' )
    ,( the_country_id, 'Commune', '124', 'Šmarje pri Jelšah' )
    ,( the_country_id, 'Commune', '125', 'Šmartno ob Paki' )
    ,( the_country_id, 'Commune', '126', 'Šoštanj' )
    ,( the_country_id, 'Commune', '127', 'Štore' )
    ,( the_country_id, 'Commune', '128', 'Tolmin' )
    ,( the_country_id, 'Commune', '129', 'Trbovlje' )
    ,( the_country_id, 'Commune', '130', 'Trebnje' )
    ,( the_country_id, 'Commune', '131', 'Tržic' )
    ,( the_country_id, 'Commune', '132', 'Turnišce' )
    ,( the_country_id, 'Commune', '133', 'Velenje' )
    ,( the_country_id, 'Commune', '134', 'Velike Lašce' )
    ,( the_country_id, 'Commune', '135', 'Videm' )
    ,( the_country_id, 'Commune', '136', 'Vipava' )
    ,( the_country_id, 'Commune', '137', 'Vitanje' )
    ,( the_country_id, 'Commune', '138', 'Vodice' )
    ,( the_country_id, 'Commune', '139', 'Vojnik' )
    ,( the_country_id, 'Commune', '140', 'Vrhnika' )
    ,( the_country_id, 'Commune', '141', 'Vuzenica' )
    ,( the_country_id, 'Commune', '142', 'Zagorje ob Savi' )
    ,( the_country_id, 'Commune', '143', 'Zavrc' )
    ,( the_country_id, 'Commune', '144', 'Zrece' )
    ,( the_country_id, 'Commune', '146', 'Železniki' )
    ,( the_country_id, 'Commune', '147', 'Žiri' )
    ,( the_country_id, 'Commune', '148', 'Benedikt' )
    ,( the_country_id, 'Commune', '149', 'Bistrica ob Sotli' )
    ,( the_country_id, 'Commune', '150', 'Bloke' )
    ,( the_country_id, 'Commune', '151', 'Braslovce' )
    ,( the_country_id, 'Commune', '152', 'Cankova' )
    ,( the_country_id, 'Commune', '153', 'Cerkvenjak' )
    ,( the_country_id, 'Commune', '154', 'Dobje' )
    ,( the_country_id, 'Commune', '155', 'Dobrna' )
    ,( the_country_id, 'Commune', '156', 'Dobrovnik' )
    ,( the_country_id, 'Commune', '157', 'Dolenjske Toplice' )
    ,( the_country_id, 'Commune', '158', 'Grad' )
    ,( the_country_id, 'Commune', '159', 'Hajdina' )
    ,( the_country_id, 'Commune', '160', 'Hoce-Slivnica' )
    ,( the_country_id, 'Commune', '161', 'Hodoš' )
    ,( the_country_id, 'Commune', '162', 'Horjul' )
    ,( the_country_id, 'Commune', '163', 'Jezersko' )
    ,( the_country_id, 'Commune', '164', 'Komenda' )
    ,( the_country_id, 'Commune', '165', 'Kostel' )
    ,( the_country_id, 'Commune', '166', 'Križevci' )
    ,( the_country_id, 'Commune', '167', 'Lovrenc na Pohorju' )
    ,( the_country_id, 'Commune', '168', 'Markovci' )
    ,( the_country_id, 'Commune', '169', 'Miklavž na Dravskem polju' )
    ,( the_country_id, 'Commune', '170', 'Mirna Pec' )
    ,( the_country_id, 'Commune', '171', 'Oplotnica' )
    ,( the_country_id, 'Commune', '172', 'Podlehnik' )
    ,( the_country_id, 'Commune', '173', 'Polzela' )
    ,( the_country_id, 'Commune', '174', 'Prebold' )
    ,( the_country_id, 'Commune', '175', 'Prevalje' )
    ,( the_country_id, 'Commune', '176', 'Razkrižje' )
    ,( the_country_id, 'Commune', '177', 'Ribnica na Pohorju' )
    ,( the_country_id, 'Commune', '178', 'Selnica ob Dravi' )
    ,( the_country_id, 'Commune', '179', 'Sodražica' )
    ,( the_country_id, 'Commune', '180', 'Solcava' )
    ,( the_country_id, 'Commune', '181', 'Sveta Ana' )
    ,( the_country_id, 'Commune', '182', 'Sveti Andraž v Slovenskih goricah' )
    ,( the_country_id, 'Commune', '183', 'Šempeter-Vrtojba' )
    ,( the_country_id, 'Commune', '184', 'Tabor' )
    ,( the_country_id, 'Commune', '185', 'Trnovska vas' )
    ,( the_country_id, 'Commune', '186', 'Trzin' )
    ,( the_country_id, 'Commune', '187', 'Velika Polana' )
    ,( the_country_id, 'Commune', '188', 'Veržej' )
    ,( the_country_id, 'Commune', '189', 'Vransko' )
    ,( the_country_id, 'Commune', '190', 'Žalec' )
    ,( the_country_id, 'Commune', '191', 'Žetale' )
    ,( the_country_id, 'Commune', '192', 'Žirovnica' )
    ,( the_country_id, 'Commune', '193', 'Žužemberk' )
    ,( the_country_id, 'Commune', '194', 'Šmartno pri Litiji' )
    ,( the_country_id, 'Commune', '195', 'Apace' )
    ,( the_country_id, 'Commune', '196', 'Cirkulane' )
    ,( the_country_id, 'Commune', '197', 'Kosanjevica na Krki' )
    ,( the_country_id, 'Commune', '198', 'Makole' )
    ,( the_country_id, 'Commune', '199', 'Mokronog-Trebelno' )
    ,( the_country_id, 'Commune', '200', 'Poljcane' )
    ,( the_country_id, 'Commune', '201', 'Renèe-Vogrsko' )
    ,( the_country_id, 'Commune', '202', 'Središce ob Dravi' )
    ,( the_country_id, 'Commune', '203', 'Straža' )
    ,( the_country_id, 'Commune', '204', 'Sveta Trojica v Slovenskih Goricah' )
    ,( the_country_id, 'Commune', '205', 'Sveti Tomaž' )
    ,( the_country_id, 'Commune', '206', 'Šmarješke Toplice' )
    ,( the_country_id, 'Commune', '207', 'Gorje' )
    ,( the_country_id, 'Commune', '208', 'Log-Dragomer' )
    ,( the_country_id, 'Commune', '209', 'Recica ob Savinji' )
    ,( the_country_id, 'Commune', '210', 'Sveti Jurij v Slovenskih Goricah' )
    ,( the_country_id, 'Commune', '211', 'Šentrupert' )
    ,( the_country_id, 'Commune', '212', 'Mirna' );
    
    -- Slovakia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SK' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'BC', 'Banskobystrický kraj' )
    ,( the_country_id, 'Region', 'BL', 'Bratislavský kraj' )
    ,( the_country_id, 'Region', 'KI', 'Košický kraj' )
    ,( the_country_id, 'Region', 'NI', 'Nitriansky kraj' )
    ,( the_country_id, 'Region', 'PV', 'Prešovský kraj' )
    ,( the_country_id, 'Region', 'TA', 'Trnavský kraj' )
    ,( the_country_id, 'Region', 'TC', 'Trenciansky kraj' )
    ,( the_country_id, 'Region', 'ZI', 'Žilinský kraj' );
    
    -- Sierra Leone
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SL' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'E', 'Eastern' )
    ,( the_country_id, 'Province', 'N', 'Northern' )
    ,( the_country_id, 'Province', 'S', 'Southern' )
    ,( the_country_id, 'Area', 'W', 'Western Area (Freetown)' );
    
    -- San Marino
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SM' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Municipality', '01', 'Acquaviva' )
    ,( the_country_id, 'Municipality', '02', 'Chiesanuova' )
    ,( the_country_id, 'Municipality', '03', 'Domagnano' )
    ,( the_country_id, 'Municipality', '04', 'Faetano' )
    ,( the_country_id, 'Municipality', '05', 'Fiorentino' )
    ,( the_country_id, 'Municipality', '06', 'Borgo Maggiore' )
    ,( the_country_id, 'Municipality', '07', 'San Marino' )
    ,( the_country_id, 'Municipality', '08', 'Montegiardino' )
    ,( the_country_id, 'Municipality', '09', 'Serravalle' );
    
    -- Senegal
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SN' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'DB ', 'Diourbel' )
    ,( the_country_id, 'Region', 'DK', 'Dakar' )
    ,( the_country_id, 'Region', 'FK', 'Fatick' )
    ,( the_country_id, 'Region', 'KA', 'Kaffrine' )
    ,( the_country_id, 'Region', 'KD', 'Kolda' )
    ,( the_country_id, 'Region', 'KE', 'Kédougou' )
    ,( the_country_id, 'Region', 'KL', 'Kaolack' )
    ,( the_country_id, 'Region', 'LG', 'Louga' )
    ,( the_country_id, 'Region', 'MT', 'Matam' )
    ,( the_country_id, 'Region', 'SE', 'Sédhiou' )
    ,( the_country_id, 'Region', 'SL', 'Saint-Louis' )
    ,( the_country_id, 'Region', 'TC', 'Tambacounda' )
    ,( the_country_id, 'Region', 'TH', 'Thiès' )
    ,( the_country_id, 'Region', 'ZG', 'Ziguinchor' );
    
    -- Somalia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SO' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'AW', 'Awdal' )
    ,( the_country_id, 'Region', 'BK', 'Bakool' )
    ,( the_country_id, 'Region', 'BN', 'Banaadir' )
    ,( the_country_id, 'Region', 'BR', 'Bari' )
    ,( the_country_id, 'Region', 'BY', 'Bay' )
    ,( the_country_id, 'Region', 'GA', 'Galguduud' )
    ,( the_country_id, 'Region', 'GE ', 'Gedo' )
    ,( the_country_id, 'Region', 'HI', 'Hiiraan' )
    ,( the_country_id, 'Region', 'JD', 'Jubbada Dhexe' )
    ,( the_country_id, 'Region', 'JH', 'Jubbada Hoose' )
    ,( the_country_id, 'Region', 'MU', 'Mudug' )
    ,( the_country_id, 'Region', 'NU', 'Nugaal' )
    ,( the_country_id, 'Region', 'SA', 'Sanaag' )
    ,( the_country_id, 'Region', 'SD', 'Shabeellaha Dhexe' )
    ,( the_country_id, 'Region', 'SH', 'Shabeellaha Hoose' )
    ,( the_country_id, 'Region', 'SO', 'Sool' )
    ,( the_country_id, 'Region', 'TO', 'Togdheer' )
    ,( the_country_id, 'Region', 'WO', 'Woqooyi Galbeed' );
    
    -- Suriname
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SR' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', 'BR', 'Brokopondo' )
    ,( the_country_id, 'District', 'CM', 'Commewijne' )
    ,( the_country_id, 'District', 'CR', 'Coronie' )
    ,( the_country_id, 'District', 'MA', 'Marowijne' )
    ,( the_country_id, 'District', 'NI', 'Nickerie' )
    ,( the_country_id, 'District', 'PM', 'Paramaribo' )
    ,( the_country_id, 'District', 'PR', 'Para' )
    ,( the_country_id, 'District', 'SA', 'Saramacca' )
    ,( the_country_id, 'District', 'SI', 'Sipaliwini' )
    ,( the_country_id, 'District', 'WA', 'Wanica' );
    
    -- South Sudan
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SS' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'State', 'BN', 'Northern Bahr el Ghazal' )
    ,( the_country_id, 'State', 'BW', 'Western Bahr el Ghazal' )
    ,( the_country_id, 'State', 'EC', 'Central Equatoria' )
    ,( the_country_id, 'State', 'EE', 'Eastern Equatoria' )
    ,( the_country_id, 'State', 'EW', 'Western Equatoria' )
    ,( the_country_id, 'State', 'JG', 'Jonglei' )
    ,( the_country_id, 'State', 'LK', 'Lakes' )
    ,( the_country_id, 'State', 'NU', 'Upper Nile' )
    ,( the_country_id, 'State', 'UY', 'Unity' )
    ,( the_country_id, 'State', 'WR', 'Warrap' );
    
    -- Sao Tome and Principe
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'ST' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'P', 'Príncipe' )
    ,( the_country_id, 'Province', 'S', 'São Tomé' );
    
    -- El Salvador
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SV' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Department', 'AH', 'Ahuachapán' )
    ,( the_country_id, 'Department', 'CA', 'Cabañas' )
    ,( the_country_id, 'Department', 'CH', 'Chalatenango' )
    ,( the_country_id, 'Department', 'CU', 'Cuscatlán' )
    ,( the_country_id, 'Department', 'LI', 'La Libertad' )
    ,( the_country_id, 'Department', 'MO', 'Morazán' )
    ,( the_country_id, 'Department', 'PA', 'La Paz' )
    ,( the_country_id, 'Department', 'SA', 'Santa Ana' )
    ,( the_country_id, 'Department', 'SM', 'San Miguel' )
    ,( the_country_id, 'Department', 'SO', 'Sonsonate' )
    ,( the_country_id, 'Department', 'SS', 'San Salvador' )
    ,( the_country_id, 'Department', 'SV', 'San Vicente' )
    ,( the_country_id, 'Department', 'UN', 'La Unión' )
    ,( the_country_id, 'Department', 'US', 'Usulután' );
    
    -- Syrian Arab Republic
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'SY' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'DI', 'Dimashq' )
    ,( the_country_id, 'Province', 'DR', 'Dar''a' )
    ,( the_country_id, 'Province', 'DY', 'Dayr az Zawr' )
    ,( the_country_id, 'Province', 'HA', 'AI Hasakah' )
    ,( the_country_id, 'Province', 'HI', 'Hims' )
    ,( the_country_id, 'Province', 'HL', 'Halab' )
    ,( the_country_id, 'Province', 'HM', 'Hamah' )
    ,( the_country_id, 'Province', 'ID', 'Idlib' )
    ,( the_country_id, 'Province', 'LA', 'AI Ladhiqiyah' )
    ,( the_country_id, 'Province', 'Qu', 'AI Qunaytirah' )
    ,( the_country_id, 'Province', 'RA', 'Ar Raqqah' )
    ,( the_country_id, 'Province', 'RD', 'Rif Dimashq' )
    ,( the_country_id, 'Province', 'SU', 'As Suwayda''' )
    ,( the_country_id, 'Province', 'TA', 'Tartus' );
    
    -- Chad
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'TD' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'BA', 'Batha' )
    ,( the_country_id, 'Region', 'BG', 'Baḩr al Ghazāl' )
    ,( the_country_id, 'Region', 'BO', 'Burku' )
    ,( the_country_id, 'Region', 'CB', 'Chari-Baguirmi' )
    ,( the_country_id, 'Region', 'EE', 'Ennedi-Est' )
    ,( the_country_id, 'Region', 'EO', 'Ennedi-Ouest' )
    ,( the_country_id, 'Region', 'GR', 'Guéra' )
    ,( the_country_id, 'Region', 'HL', 'Hadjer Lamis' )
    ,( the_country_id, 'Region', 'KA', 'Kanem' )
    ,( the_country_id, 'Region', 'LC', 'Lac' )
    ,( the_country_id, 'Region', 'LO', 'Logone-Occidental' )
    ,( the_country_id, 'Region', 'LR', 'Logone-Oriental' )
    ,( the_country_id, 'Region', 'MA', 'Mandoul' )
    ,( the_country_id, 'Region', 'MC', 'Moyen-Chari' )
    ,( the_country_id, 'Region', 'ME', 'Mayo-Kebbi-Est' )
    ,( the_country_id, 'Region', 'MO', 'Mayo-Kebbi-Ouest' )
    ,( the_country_id, 'Region', 'ND', 'Ville de Ndjamena' )
    ,( the_country_id, 'Region', 'OD', 'Ouaddaï' )
    ,( the_country_id, 'Region', 'SA', 'Salamat' )
    ,( the_country_id, 'Region', 'SI', 'Sila' )
    ,( the_country_id, 'Region', 'TA', 'Tandjilé' )
    ,( the_country_id, 'Region', 'TI', 'Tibasti' )
    ,( the_country_id, 'Region', 'WF', 'Wadi Fira' );
    
    -- Togo
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'TG' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'C', 'Centre' )
    ,( the_country_id, 'Region', 'K', 'Kara' )
    ,( the_country_id, 'Region', 'M', 'Maritime (Région)' )
    ,( the_country_id, 'Region', 'P', 'Plateaux' )
    ,( the_country_id, 'Region', 'S', 'Savannes' );
    
    -- Thailand
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'TH' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Metropolitan administration', '10', 'Krung Thep Maha Nakhon [Bangkok]' )
    ,( the_country_id, 'Province', '11', 'Samut Prakan' )
    ,( the_country_id, 'Province', '12', 'Nonthaburi' )
    ,( the_country_id, 'Province', '13', 'Pathum Thani' )
    ,( the_country_id, 'Province', '14', 'Phra Nakhon Si Ayutthaya' )
    ,( the_country_id, 'Province', '15', 'Ang Thong' )
    ,( the_country_id, 'Province', '16', 'Lop Buri' )
    ,( the_country_id, 'Province', '17', 'Sing Buri' )
    ,( the_country_id, 'Province', '18', 'Chai Nat' )
    ,( the_country_id, 'Province', '19', 'Saraburi' )
    ,( the_country_id, 'Province', '20', 'Chon Buri' )
    ,( the_country_id, 'Province', '21', 'Rayong' )
    ,( the_country_id, 'Province', '22', 'Chanthaburi' )
    ,( the_country_id, 'Province', '23', 'Trat' )
    ,( the_country_id, 'Province', '24', 'Chachoengsao' )
    ,( the_country_id, 'Province', '25', 'Prachin Buri' )
    ,( the_country_id, 'Province', '26', 'Nakhon Nayok' )
    ,( the_country_id, 'Province', '27', 'Sa Kaeo' )
    ,( the_country_id, 'Province', '30', 'Nakhon Ratchasima' )
    ,( the_country_id, 'Province', '31', 'Buri Ram' )
    ,( the_country_id, 'Province', '32', 'Surin' )
    ,( the_country_id, 'Province', '33', 'Si Sa Ket' )
    ,( the_country_id, 'Province', '34', 'Ubon Ratchathani' )
    ,( the_country_id, 'Province', '35', 'Yasothon' )
    ,( the_country_id, 'Province', '36', 'Chaiyaphum' )
    ,( the_country_id, 'Province', '37', 'Amnat Charoen' )
    ,( the_country_id, 'Province', '38', 'Bueng Kan' )
    ,( the_country_id, 'Province', '39', 'Nong Bua Lam Phu' )
    ,( the_country_id, 'Province', '40', 'Khon Kaen' )
    ,( the_country_id, 'Province', '41', 'Udon Thani' )
    ,( the_country_id, 'Province', '42', 'Loei' )
    ,( the_country_id, 'Province', '43', 'Nong Khai' )
    ,( the_country_id, 'Province', '44', 'Maha Sarakham' )
    ,( the_country_id, 'Province', '45', 'Roi Et' )
    ,( the_country_id, 'Province', '46', 'Kalasin' )
    ,( the_country_id, 'Province', '47', 'Sakon Nakhon' )
    ,( the_country_id, 'Province', '48', 'Nakhon Phanom' )
    ,( the_country_id, 'Province', '49', 'Mukdahan' )
    ,( the_country_id, 'Province', '50', 'Chiang Mai' )
    ,( the_country_id, 'Province', '51', 'Lamphun' )
    ,( the_country_id, 'Province', '52', 'Lampang' )
    ,( the_country_id, 'Province', '53', 'Uttaradit' )
    ,( the_country_id, 'Province', '54', 'Phrae' )
    ,( the_country_id, 'Province', '55', 'Nan' )
    ,( the_country_id, 'Province', '56', 'Phayao' )
    ,( the_country_id, 'Province', '57', 'Chiang Rai' )
    ,( the_country_id, 'Province', '58', 'Mae Hong Son' )
    ,( the_country_id, 'Province', '60', 'Nakhon Sawan' )
    ,( the_country_id, 'Province', '61', 'Uthai Thani' )
    ,( the_country_id, 'Province', '62', 'Kamphaeng Phet' )
    ,( the_country_id, 'Province', '63', 'Tak' )
    ,( the_country_id, 'Province', '64', 'Sukhothai' )
    ,( the_country_id, 'Province', '65', 'Phitsanulok' )
    ,( the_country_id, 'Province', '66', 'Phichit' )
    ,( the_country_id, 'Province', '67', 'Phetchabun' )
    ,( the_country_id, 'Province', '70', 'Ratchaburi' )
    ,( the_country_id, 'Province', '71', 'Kanchanaburi' )
    ,( the_country_id, 'Province', '72', 'Suphan Buri' )
    ,( the_country_id, 'Province', '73', 'Nakhon Pathom' )
    ,( the_country_id, 'Province', '74', 'Samut Sakhon' )
    ,( the_country_id, 'Province', '75', 'Samut Songkhram' )
    ,( the_country_id, 'Province', '76', 'Phetchaburi' )
    ,( the_country_id, 'Province', '77', 'Prachuap Khiri Khan' )
    ,( the_country_id, 'Province', '80', 'Nakhon Si Thammarat' )
    ,( the_country_id, 'Province', '81', 'Krabi' )
    ,( the_country_id, 'Province', '82', 'Phangnga' )
    ,( the_country_id, 'Province', '83', 'Phuket' )
    ,( the_country_id, 'Province', '84', 'Surat Thani' )
    ,( the_country_id, 'Province', '85', 'Ranong' )
    ,( the_country_id, 'Province', '86', 'Chumphon' )
    ,( the_country_id, 'Province', '90', 'Songkhla' )
    ,( the_country_id, 'Province', '91', 'Satun' )
    ,( the_country_id, 'Province', '92', 'Trang' )
    ,( the_country_id, 'Province', '93', 'Phatthalung' )
    ,( the_country_id, 'Province', '94', 'Pattani' )
    ,( the_country_id, 'Province', '95', 'Yala' )
    ,( the_country_id, 'Province', '96', 'Narathiwat' )
    ,( the_country_id, 'Special administrative city', 'S ', 'Phatthaya' );
    
    -- Tajikistan
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'TJ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Capital territory', 'DU', 'Dushanbe' )
    ,( the_country_id, 'Autonomous region', 'GB', 'Kuhistoni Badakhshon' )
    ,( the_country_id, 'Region', 'KT', 'Khatlon' )
    ,( the_country_id, 'Region', 'SU', 'Sughd' );
    
    -- Timor-Leste
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'TL' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', 'AL', 'Aileu' )
    ,( the_country_id, 'District', 'AN', 'Ainaro' )
    ,( the_country_id, 'District', 'BA', 'Baucau' )
    ,( the_country_id, 'District', 'BO', 'Bobonaro' )
    ,( the_country_id, 'District', 'CO', 'Cova Lima' )
    ,( the_country_id, 'District', 'DI', 'Díli' )
    ,( the_country_id, 'District', 'ER', 'Ermera' )
    ,( the_country_id, 'District', 'LA', 'Lautem' )
    ,( the_country_id, 'District', 'LI', 'Liquiça' )
    ,( the_country_id, 'District', 'MF', 'Manufahi' )
    ,( the_country_id, 'District', 'MT', 'Manatuto' )
    ,( the_country_id, 'District', 'OE', 'Oecussi' )
    ,( the_country_id, 'District', 'VI', 'Viqueque' );
    
    -- Turkmenistan
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'TM' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'A', 'Ahal' )
    ,( the_country_id, 'Region', 'B', 'Balkan' )
    ,( the_country_id, 'Region', 'D', 'Dasoguz' )
    ,( the_country_id, 'Region', 'L', 'Lebap' )
    ,( the_country_id, 'Region', 'M', 'Mary' )
    ,( the_country_id, 'City', 'S', 'Asgabat' );
    
    -- Tunisia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'TN' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Governorate', '11', 'Tunis' )
    ,( the_country_id, 'Governorate', '12', 'Ariana' )
    ,( the_country_id, 'Governorate', '13', 'Ben Arous' )
    ,( the_country_id, 'Governorate', '14', 'La Manouba' )
    ,( the_country_id, 'Governorate', '21', 'Nabeul' )
    ,( the_country_id, 'Governorate', '22', 'Zaghouan' )
    ,( the_country_id, 'Governorate', '23', 'Bizerte' )
    ,( the_country_id, 'Governorate', '31', 'Béja' )
    ,( the_country_id, 'Governorate', '32', 'Jendouba' )
    ,( the_country_id, 'Governorate', '33', 'Le Kef' )
    ,( the_country_id, 'Governorate', '34', 'Siliana' )
    ,( the_country_id, 'Governorate', '41', 'Kairouan' )
    ,( the_country_id, 'Governorate', '42', 'Kasserine' )
    ,( the_country_id, 'Governorate', '43', 'Sidi Bouzid' )
    ,( the_country_id, 'Governorate', '51', 'Sousse' )
    ,( the_country_id, 'Governorate', '52', 'Monastir' )
    ,( the_country_id, 'Governorate', '53', 'Mahdia' )
    ,( the_country_id, 'Governorate', '61', 'Sfax' )
    ,( the_country_id, 'Governorate', '71', 'Gafsa' )
    ,( the_country_id, 'Governorate', '72', 'Tozeur' )
    ,( the_country_id, 'Governorate', '73', 'Kebili' )
    ,( the_country_id, 'Governorate', '81', 'Gabès' )
    ,( the_country_id, 'Governorate', '82', 'Medenine' )
    ,( the_country_id, 'Governorate', '83', 'Tataouine' );
    
    -- Tonga
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'TO' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Division', '01', '''Eua' )
    ,( the_country_id, 'Division', '02', 'Ha''apai' )
    ,( the_country_id, 'Division', '03', 'Niuas' )
    ,( the_country_id, 'Division', '04', 'Tongatapu' )
    ,( the_country_id, 'Division', '05', 'Vava''u' );
    
    -- Turkey
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'TR' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', '01', 'Adana' )
    ,( the_country_id, 'Province', '02', 'Adiyaman' )
    ,( the_country_id, 'Province', '03', 'Afyonkarahisar' )
    ,( the_country_id, 'Province', '04', 'Agri' )
    ,( the_country_id, 'Province', '05', 'Amasya' )
    ,( the_country_id, 'Province', '06', 'Ankara' )
    ,( the_country_id, 'Province', '07', 'Antalya' )
    ,( the_country_id, 'Province', '08', 'Artvin' )
    ,( the_country_id, 'Province', '09', 'Aydin' )
    ,( the_country_id, 'Province', '10', 'Balikesir' )
    ,( the_country_id, 'Province', '11', 'Bilecik' )
    ,( the_country_id, 'Province', '12', 'Bingöl' )
    ,( the_country_id, 'Province', '13', 'Bitlis' )
    ,( the_country_id, 'Province', '14', 'Bolu' )
    ,( the_country_id, 'Province', '15', 'Burdur' )
    ,( the_country_id, 'Province', '16', 'Bursa' )
    ,( the_country_id, 'Province', '17', 'Canakkale' )
    ,( the_country_id, 'Province', '18', 'Çankiri' )
    ,( the_country_id, 'Province', '19', 'Corum' )
    ,( the_country_id, 'Province', '20', 'Denizli' )
    ,( the_country_id, 'Province', '21', 'Diyarbakir' )
    ,( the_country_id, 'Province', '22', 'Edirne' )
    ,( the_country_id, 'Province', '23', 'Elazig' )
    ,( the_country_id, 'Province', '24', 'Erzincan' )
    ,( the_country_id, 'Province', '25', 'Erzurum' )
    ,( the_country_id, 'Province', '26', 'Eskisehir' )
    ,( the_country_id, 'Province', '27', 'Gaziantep' )
    ,( the_country_id, 'Province', '28', 'Giresun' )
    ,( the_country_id, 'Province', '29', 'Gümüshane' )
    ,( the_country_id, 'Province', '30', 'Hakkari' )
    ,( the_country_id, 'Province', '31', 'Hatay' )
    ,( the_country_id, 'Province', '32', 'Isparta' )
    ,( the_country_id, 'Province', '33', 'Mersin' )
    ,( the_country_id, 'Province', '34', 'Istanbul' )
    ,( the_country_id, 'Province', '35', 'Izmir' )
    ,( the_country_id, 'Province', '36', 'Kars' )
    ,( the_country_id, 'Province', '37', 'Kastamonu' )
    ,( the_country_id, 'Province', '38', 'Kayseri' )
    ,( the_country_id, 'Province', '39', 'Kirklareli' )
    ,( the_country_id, 'Province', '40', 'Kirsehir' )
    ,( the_country_id, 'Province', '41', 'Kocaeli' )
    ,( the_country_id, 'Province', '42', 'Konya' )
    ,( the_country_id, 'Province', '43', 'Kütahya' )
    ,( the_country_id, 'Province', '44', 'Malatya' )
    ,( the_country_id, 'Province', '45', 'Manisa' )
    ,( the_country_id, 'Province', '46', 'Kahramanmaras' )
    ,( the_country_id, 'Province', '47', 'Mardin' )
    ,( the_country_id, 'Province', '48', 'Mugla' )
    ,( the_country_id, 'Province', '49', 'Mus' )
    ,( the_country_id, 'Province', '50', 'Nevsehir' )
    ,( the_country_id, 'Province', '51', 'Nigde' )
    ,( the_country_id, 'Province', '52', 'Ordu' )
    ,( the_country_id, 'Province', '53', 'Rize' )
    ,( the_country_id, 'Province', '54', 'Sakarya' )
    ,( the_country_id, 'Province', '55', 'Samsun' )
    ,( the_country_id, 'Province', '56', 'Siirt' )
    ,( the_country_id, 'Province', '57', 'Sinop' )
    ,( the_country_id, 'Province', '58', 'Sivas' )
    ,( the_country_id, 'Province', '59', 'Tekirdag' )
    ,( the_country_id, 'Province', '60', 'Tokat' )
    ,( the_country_id, 'Province', '61', 'Trabzon' )
    ,( the_country_id, 'Province', '62', 'Tunceli' )
    ,( the_country_id, 'Province', '63', 'Sanliurfa' )
    ,( the_country_id, 'Province', '64', 'Usak' )
    ,( the_country_id, 'Province', '65', 'Van' )
    ,( the_country_id, 'Province', '66', 'Yozgat' )
    ,( the_country_id, 'Province', '67', 'Zonguldak' )
    ,( the_country_id, 'Province', '68', 'Aksaray' )
    ,( the_country_id, 'Province', '69', 'Bayburt' )
    ,( the_country_id, 'Province', '70', 'Karaman' )
    ,( the_country_id, 'Province', '71', 'Kirikkale' )
    ,( the_country_id, 'Province', '72', 'Batman' )
    ,( the_country_id, 'Province', '73', 'Sirnak' )
    ,( the_country_id, 'Province', '74', 'Bartin' )
    ,( the_country_id, 'Province', '75', 'Ardahan' )
    ,( the_country_id, 'Province', '76', 'Igdir' )
    ,( the_country_id, 'Province', '77', 'Yalova' )
    ,( the_country_id, 'Province', '78', 'Karabuk' )
    ,( the_country_id, 'Province', '79', 'Kilis' )
    ,( the_country_id, 'Province', '80', 'Osmaniye' )
    ,( the_country_id, 'Province', '81', 'Düzce' );
    
    -- Trinidad and Tobago
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'TT' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Municipality', 'ARI', 'Arima' )
    ,( the_country_id, 'Municipality', 'CHA', 'Chaguanas' )
    ,( the_country_id, 'Region', 'CTT', 'Couva-Tabaquite-Talparo' )
    ,( the_country_id, 'Region', 'DMN', 'Diego Martin' )
    ,( the_country_id, 'Region', 'ETO', 'Eastern Tobago' )
    ,( the_country_id, 'Region', 'PED', 'Penal-Debe' )
    ,( the_country_id, 'Municipality', 'POS', 'Port of Spain' )
    ,( the_country_id, 'Region', 'PRT', 'Princes Town' )
    ,( the_country_id, 'Municipality', 'PTF', 'Point Fortin' )
    ,( the_country_id, 'Region', 'RCM', 'Rio Claro-Mayaro' )
    ,( the_country_id, 'Municipality', 'SFO', 'San Fernando' )
    ,( the_country_id, 'Region', 'SGE', 'Sangre Grande' )
    ,( the_country_id, 'Region', 'SIP', 'Siparia' )
    ,( the_country_id, 'Region', 'SJL', 'San Juan-Laventille' )
    ,( the_country_id, 'Region', 'TUP', 'Tunapuna-Piarco' )
    ,( the_country_id, 'Region', 'WTO', 'Western Tobago' );
    
    -- Tuvalu
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'TV' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Town council', 'FUN', 'Funafuti' )
    ,( the_country_id, 'Island council', 'NIT', 'Niutao' )
    ,( the_country_id, 'Island council', 'NIU', 'Nui' )
    ,( the_country_id, 'Island council', 'NKF', 'Nukufetau' )
    ,( the_country_id, 'Island council', 'NKL', 'Nukulaelae' )
    ,( the_country_id, 'Island council', 'NMA', 'Nanumea' )
    ,( the_country_id, 'Island council', 'NMG', 'Nanumanga' )
    ,( the_country_id, 'Island council', 'VAI', 'Vaitupu' );
    
    -- Taiwan, Province of China
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'TW' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', 'CHA', 'Changhua' )
    ,( the_country_id, 'Municipality', 'CYI', 'Chiayi' )
    ,( the_country_id, 'District', 'CYQ', 'Chiayi' )
    ,( the_country_id, 'District', 'HSQ', 'Hsinchu' )
    ,( the_country_id, 'Municipality', 'HSZ', 'Hsinchu' )
    ,( the_country_id, 'District', 'HUA', 'Hualien' )
    ,( the_country_id, 'District', 'ILA', 'Ilan' )
    ,( the_country_id, 'Municipality', 'KEE', 'Keelung' )
    ,( the_country_id, 'Special Municipality', 'KHH', 'Kaohsiung' )
    ,( the_country_id, 'District', 'KHQ', 'Kaohsiung' )
    ,( the_country_id, 'District', 'MIA', 'Miaoli' )
    ,( the_country_id, 'District', 'NAN', 'Nantou' )
    ,( the_country_id, 'District', 'PEN', 'Penghu' )
    ,( the_country_id, 'District', 'PIF', 'Pingtung' )
    ,( the_country_id, 'District', 'TAO', 'Taoyuan' )
    ,( the_country_id, 'Municipality', 'TNN', 'Tainan' )
    ,( the_country_id, 'District', 'TNQ', 'Tainan' )
    ,( the_country_id, 'Special Municipality', 'TPE', 'Taipei' )
    ,( the_country_id, 'District', 'TPQ', 'Taipei' )
    ,( the_country_id, 'District', 'TTT', 'Taitung' )
    ,( the_country_id, 'Municipality', 'TXG', 'Taichung' )
    ,( the_country_id, 'District', 'TXQ', 'Taichung' )
    ,( the_country_id, 'District', 'YUN', 'Yunlin' );
    
    -- Tanzania, United Republic of
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'TZ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', '01', 'Arusha' )
    ,( the_country_id, 'Region', '02', 'Dar es Salaam' )
    ,( the_country_id, 'Region', '03', 'Dodoma' )
    ,( the_country_id, 'Region', '04', 'Iringa' )
    ,( the_country_id, 'Region', '05', 'Kagera' )
    ,( the_country_id, 'Region', '06', 'Kaskazini Pemba' )
    ,( the_country_id, 'Region', '07', 'Kaskazini Unguja' )
    ,( the_country_id, 'Region', '08', 'Kigoma' )
    ,( the_country_id, 'Region', '09', 'Kilimanjaro' )
    ,( the_country_id, 'Region', '10', 'Kusini Pemba' )
    ,( the_country_id, 'Region', '11', 'Kusini Unguja' )
    ,( the_country_id, 'Region', '12', 'Lindi' )
    ,( the_country_id, 'Region', '13', 'Mara' )
    ,( the_country_id, 'Region', '14', 'Mbeya' )
    ,( the_country_id, 'Region', '15', 'Mjini Magharibi' )
    ,( the_country_id, 'Region', '16', 'Morogoro' )
    ,( the_country_id, 'Region', '17', 'Mtwara' )
    ,( the_country_id, 'Region', '18', 'Mwanza' )
    ,( the_country_id, 'Region', '19', 'Pwani' )
    ,( the_country_id, 'Region', '20', 'Rukwa' )
    ,( the_country_id, 'Region', '21', 'Ruvuma' )
    ,( the_country_id, 'Region', '22', 'Shinyanga' )
    ,( the_country_id, 'Region', '23', 'Singida' )
    ,( the_country_id, 'Region', '24', 'Tabora' )
    ,( the_country_id, 'Region', '25', 'Tanga' )
    ,( the_country_id, 'Region', '26', 'Manyara' )
    ,( the_country_id, 'Region', '27', 'Geita' )
    ,( the_country_id, 'Region', '28', 'Katavi' )
    ,( the_country_id, 'Region', '29', 'Njombe' )
    ,( the_country_id, 'Region', '30', 'Simiyu' );
    
    -- Ukraine
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'UA' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', '05', 'Vinnytska oblast' )
    ,( the_country_id, 'Region', '07', 'Volynska oblast' )
    ,( the_country_id, 'Region', '09', 'Luhanska oblast' )
    ,( the_country_id, 'Region', '12', 'Dnipropetrovska oblast' )
    ,( the_country_id, 'Region', '14', 'Donetska oblast' )
    ,( the_country_id, 'Region', '18', 'Zhytomyrska oblast' )
    ,( the_country_id, 'Region', '21', 'Zakarpatska oblast' )
    ,( the_country_id, 'Region', '23', 'Zaporizka oblast' )
    ,( the_country_id, 'Region', '26', 'Ivano-Frankivska oblast' )
    ,( the_country_id, 'City', '30', 'Kyiv' )
    ,( the_country_id, 'Region', '32', 'Kyivska oblast' )
    ,( the_country_id, 'Region', '35', 'Kirovohradska oblast' )
    ,( the_country_id, 'City', '40', 'Sevastopol' )
    ,( the_country_id, 'Republic', '43', 'Avtonomna Respublika Krym' )
    ,( the_country_id, 'Region', '46', 'Lvivska oblast' )
    ,( the_country_id, 'Region', '48', 'Mykolaivska oblast' )
    ,( the_country_id, 'Region', '51', 'Odeska oblast' )
    ,( the_country_id, 'Region', '53', 'Poltavska oblast' )
    ,( the_country_id, 'Region', '56', 'Rivnenska oblast' )
    ,( the_country_id, 'Region', '59', 'Sumska oblast' )
    ,( the_country_id, 'Region', '61', 'Ternopilska oblast' )
    ,( the_country_id, 'Region', '63', 'Kharkivska oblast' )
    ,( the_country_id, 'Region', '65', 'Khersonska oblast' )
    ,( the_country_id, 'Region', '68', 'Khmelnytska oblast' )
    ,( the_country_id, 'Region', '71', 'Cherkaska oblast' )
    ,( the_country_id, 'Region', '74', 'Chernihivska oblast' )
    ,( the_country_id, 'Region', '77', 'Chernivetska oblast' );
    
    -- Uganda
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'UG' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', '101', 'Kalangala' )
    ,( the_country_id, 'City', '102', 'Kampala' )
    ,( the_country_id, 'District', '103', 'Kiboga' )
    ,( the_country_id, 'District', '104', 'Luwero' )
    ,( the_country_id, 'District', '105', 'Masaka' )
    ,( the_country_id, 'District', '106', 'Mpigi' )
    ,( the_country_id, 'District', '107', 'Mubende' )
    ,( the_country_id, 'District', '108', 'Mukono' )
    ,( the_country_id, 'District', '109', 'Nakasongola' )
    ,( the_country_id, 'District', '110', 'Rakai' )
    ,( the_country_id, 'District', '111', 'Sembabule' )
    ,( the_country_id, 'District', '112', 'Kayunga' )
    ,( the_country_id, 'District', '113', 'Wakiso' )
    ,( the_country_id, 'District', '114', 'Mityana' )
    ,( the_country_id, 'District', '115', 'Nakaseke' )
    ,( the_country_id, 'District', '116', 'Lyantonde' )
    ,( the_country_id, 'District', '117', 'Buikwe' )
    ,( the_country_id, 'District', '118', 'Bukomansibi' )
    ,( the_country_id, 'District', '119', 'Butambala' )
    ,( the_country_id, 'District', '120', 'Buvuma' )
    ,( the_country_id, 'District', '121', 'Gomba' )
    ,( the_country_id, 'District', '122', 'Kalungu' )
    ,( the_country_id, 'District', '123', 'Kyankwanzi' )
    ,( the_country_id, 'District', '124', 'Lwengo' )
    ,( the_country_id, 'District', '201', 'Bugiri' )
    ,( the_country_id, 'District', '202', 'Busia' )
    ,( the_country_id, 'District', '203', 'Iganga' )
    ,( the_country_id, 'District', '204', 'Jinja' )
    ,( the_country_id, 'District', '205', 'Kamuli' )
    ,( the_country_id, 'District', '206', 'Kapchorwa' )
    ,( the_country_id, 'District', '207', 'Katakwi' )
    ,( the_country_id, 'District', '208', 'Kumi' )
    ,( the_country_id, 'District', '209', 'Mbale' )
    ,( the_country_id, 'District', '210', 'Pallisa' )
    ,( the_country_id, 'District', '211', 'Soroti' )
    ,( the_country_id, 'District', '212', 'Tororo' )
    ,( the_country_id, 'District', '213', 'Kaberamaido' )
    ,( the_country_id, 'District', '215', 'Sironko' )
    ,( the_country_id, 'District', '216', 'Amuria' )
    ,( the_country_id, 'District', '217', 'Budaka' )
    ,( the_country_id, 'District', '218', 'Bukwa' )
    ,( the_country_id, 'District', '219', 'Butaleja' )
    ,( the_country_id, 'District', '220', 'Kaliro' )
    ,( the_country_id, 'District', '221', 'Manafwa' )
    ,( the_country_id, 'District', '222', 'Namutumba' )
    ,( the_country_id, 'District', '223', 'Bududa' )
    ,( the_country_id, 'District', '224', 'Bukedea' )
    ,( the_country_id, 'District', '225', 'Bulambuli' )
    ,( the_country_id, 'District', '226', 'Buyende' )
    ,( the_country_id, 'District', '227', 'Kibuku' )
    ,( the_country_id, 'District', '228', 'Kween' )
    ,( the_country_id, 'District', '229', 'Luuka' )
    ,( the_country_id, 'District', '230', 'Namayingo' )
    ,( the_country_id, 'District', '231', 'Ngora' )
    ,( the_country_id, 'District', '232', 'Serere' )
    ,( the_country_id, 'District', '244', 'Mayuge' )
    ,( the_country_id, 'District', '301', 'Adjumani' )
    ,( the_country_id, 'District', '302', 'Apac' )
    ,( the_country_id, 'District', '303', 'Arua' )
    ,( the_country_id, 'District', '304', 'Gulu' )
    ,( the_country_id, 'District', '305', 'Kitgum' )
    ,( the_country_id, 'District', '306', 'Kotido' )
    ,( the_country_id, 'District', '307', 'Lira' )
    ,( the_country_id, 'District', '308', 'Moroto' )
    ,( the_country_id, 'District', '309', 'Moyo' )
    ,( the_country_id, 'District', '310', 'Nebbi' )
    ,( the_country_id, 'District', '311', 'Nakapiripirit' )
    ,( the_country_id, 'District', '312', 'Pader' )
    ,( the_country_id, 'District', '313', 'Yumbe' )
    ,( the_country_id, 'District', '314', 'Amolatar' )
    ,( the_country_id, 'District', '315', 'Kaabong' )
    ,( the_country_id, 'District', '316', 'Koboko' )
    ,( the_country_id, 'District', '317', 'Abim' )
    ,( the_country_id, 'District', '318', 'Dokolo' )
    ,( the_country_id, 'District', '319', 'Amuru' )
    ,( the_country_id, 'District', '320', 'Maracha' )
    ,( the_country_id, 'District', '321', 'Oyam' )
    ,( the_country_id, 'District', '401', 'Bundibugyo' )
    ,( the_country_id, 'District', '402', 'Bushenyi' )
    ,( the_country_id, 'District', '403', 'Hoima' )
    ,( the_country_id, 'District', '404', 'Kabale' )
    ,( the_country_id, 'District', '405', 'Kabarole' )
    ,( the_country_id, 'District', '406', 'Kasese' )
    ,( the_country_id, 'District', '407', 'Kibaale' )
    ,( the_country_id, 'District', '408', 'Kisoro' )
    ,( the_country_id, 'District', '409', 'Masindi' )
    ,( the_country_id, 'District', '410', 'Mbarara' )
    ,( the_country_id, 'District', '411', 'Ntungamo' )
    ,( the_country_id, 'District', '412', 'Rukungiri' )
    ,( the_country_id, 'District', '413', 'Kamwenge' )
    ,( the_country_id, 'District', '414', 'Kanungu' )
    ,( the_country_id, 'District', '415', 'Kyenjojo' )
    ,( the_country_id, 'District', '416', 'Ibanda' )
    ,( the_country_id, 'District', '417', 'Isingiro' )
    ,( the_country_id, 'District', '418', 'Kiruhura' )
    ,( the_country_id, 'District', '419', 'Buliisa' )
    ,( the_country_id, 'District', '420', 'Kiryandongo' )
    ,( the_country_id, 'District', '421', 'Kyegegwa' )
    ,( the_country_id, 'District', '422', 'Mitooma' )
    ,( the_country_id, 'District', '423', 'Ntoroko' )
    ,( the_country_id, 'District', '424', 'Rubirizi' )
    ,( the_country_id, 'District', '425', 'Sheema' );
    
    -- United States Minor Outlying Islands
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'UM' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Islands/Groups of Islands', '67', 'Johnston Atoll' )
    ,( the_country_id, 'Islands/Groups of Islands', '71', 'Midway Islands' )
    ,( the_country_id, 'Islands/Groups of Islands', '76', 'Navassa Island' )
    ,( the_country_id, 'Islands/Groups of Islands', '79', 'Wake Island' )
    ,( the_country_id, 'Islands/Groups of Islands', '81', 'Baker Island' )
    ,( the_country_id, 'Islands/Groups of Islands', '84', 'Howland Island' )
    ,( the_country_id, 'Islands/Groups of Islands', '86', 'Jarvis Island' )
    ,( the_country_id, 'Islands/Groups of Islands', '89', 'Kingman Reef' )
    ,( the_country_id, 'Islands/Groups of Islands', '95', 'Palmyra Atoll' );
    
    -- Uruguay
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'UY' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Department', 'AR', 'Artigas' )
    ,( the_country_id, 'Department', 'CA', 'Canelones' )
    ,( the_country_id, 'Department', 'CL', 'Cerro Largo' )
    ,( the_country_id, 'Department', 'CO', 'Colonia' )
    ,( the_country_id, 'Department', 'DU', 'Durazno' )
    ,( the_country_id, 'Department', 'FD', 'Florida' )
    ,( the_country_id, 'Department', 'FS', 'Flores' )
    ,( the_country_id, 'Department', 'LA', 'Lavalleja' )
    ,( the_country_id, 'Department', 'MA', 'Maldonado' )
    ,( the_country_id, 'Department', 'MO', 'Montevideo' )
    ,( the_country_id, 'Department', 'PA', 'Paysandú' )
    ,( the_country_id, 'Department', 'RN', 'Río Negro' )
    ,( the_country_id, 'Department', 'RO', 'Rocha' )
    ,( the_country_id, 'Department', 'RV', 'Rivera' )
    ,( the_country_id, 'Department', 'SA', 'Salto' )
    ,( the_country_id, 'Department', 'SJ', 'San José' )
    ,( the_country_id, 'Department', 'SO', 'Soriano' )
    ,( the_country_id, 'Department', 'TA', 'Tacuarembó' )
    ,( the_country_id, 'Department', 'TT', 'Treinta y Tres' );
    
    -- Uzbekistan
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'UZ' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'AN', 'Andijon' )
    ,( the_country_id, 'Region', 'BU', 'Bukhoro' )
    ,( the_country_id, 'Region', 'FA', 'Farg‘ona' )
    ,( the_country_id, 'Region', 'JI', 'Jizzax' )
    ,( the_country_id, 'Region', 'KH', 'Khorazm' )
    ,( the_country_id, 'Region', 'NG', 'Namangan' )
    ,( the_country_id, 'Region', 'NW', 'Nawoiy' )
    ,( the_country_id, 'Region', 'QA', 'Qashqadaryo' )
    ,( the_country_id, 'Republic', 'QR', 'Qoraqalpog‘iston Respublikasi' )
    ,( the_country_id, 'Region', 'SA', 'Samarqand' )
    ,( the_country_id, 'Region', 'SI', 'Sirdaryo' )
    ,( the_country_id, 'Region', 'SU', 'Surkhondaryo' )
    ,( the_country_id, 'City', 'TK', 'Toshkent' )
    ,( the_country_id, 'Region', 'TO', 'Toshkent' )
    ,( the_country_id, 'Region', 'XO', 'Xorazm' );
    
    -- Saint Vincent and the Grenadines
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'VC' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Parish', '01', 'Charlotte     ' )
    ,( the_country_id, 'Parish', '02', 'Saint Andrew  ' )
    ,( the_country_id, 'Parish', '03', 'Saint David   ' )
    ,( the_country_id, 'Parish', '04', 'Saint George  ' )
    ,( the_country_id, 'Parish', '05', 'Saint Patrick ' )
    ,( the_country_id, 'Parish', '06', 'Grenadines    ' );
    
    -- Venezuela (Bolivarian Republic of)
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'VE' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Capital district', 'A', 'Distrito Capital' )
    ,( the_country_id, 'State', 'B', 'Anzoátegui' )
    ,( the_country_id, 'State', 'C', 'Apure' )
    ,( the_country_id, 'State', 'D', 'Aragua' )
    ,( the_country_id, 'State', 'E', 'Barinas' )
    ,( the_country_id, 'State', 'F', 'Bolívar' )
    ,( the_country_id, 'State', 'G', 'Carabobo' )
    ,( the_country_id, 'State', 'H', 'Cojedes' )
    ,( the_country_id, 'State', 'I', 'Falcón' )
    ,( the_country_id, 'State', 'J', 'Guárico' )
    ,( the_country_id, 'State', 'K', 'Lara' )
    ,( the_country_id, 'State', 'L', 'Mérida' )
    ,( the_country_id, 'State', 'M', 'Miranda' )
    ,( the_country_id, 'State', 'N', 'Monagas' )
    ,( the_country_id, 'State', 'O', 'Nueva Esparta' )
    ,( the_country_id, 'State', 'P', 'Portuguesa' )
    ,( the_country_id, 'State', 'R', 'Sucre' )
    ,( the_country_id, 'State', 'S', 'Táchira' )
    ,( the_country_id, 'State', 'T', 'Trujillo' )
    ,( the_country_id, 'State', 'U', 'Yaracuy' )
    ,( the_country_id, 'State', 'V', 'Zulia' )
    ,( the_country_id, 'Federal dependencies', 'W', 'Dependencias Federales' )
    ,( the_country_id, 'State', 'X', 'vargas' )
    ,( the_country_id, 'State', 'Y', 'Delta Amacuro' )
    ,( the_country_id, 'State', 'Z', 'Amazonas' );
    
    -- Viet Nam
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'VN' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', '01', 'Lai Châu' )
    ,( the_country_id, 'Province', '02', 'Lào Cai' )
    ,( the_country_id, 'Province', '03', 'Hà Giang' )
    ,( the_country_id, 'Province', '04', 'Cao Bằng' )
    ,( the_country_id, 'Province', '05', 'Son La' )
    ,( the_country_id, 'Province', '06', 'Yên Bái' )
    ,( the_country_id, 'Province', '07', 'Tuyên Quang' )
    ,( the_country_id, 'Province', '09', 'Lạng Sơn' )
    ,( the_country_id, 'Province', '13', 'Quảng Ninh' )
    ,( the_country_id, 'Province', '14', 'Hòa Bình' )
    ,( the_country_id, 'Province', '18', 'Ninh Bình' )
    ,( the_country_id, 'Province', '20', 'Thái Bình' )
    ,( the_country_id, 'Province', '21', 'Thanh Hóa' )
    ,( the_country_id, 'Province', '22', 'Nghệ An' )
    ,( the_country_id, 'Province', '23', 'Hà Tinh' )
    ,( the_country_id, 'Province', '24', 'Quảng Bình' )
    ,( the_country_id, 'Province', '25', 'Quảng Trị' )
    ,( the_country_id, 'Province', '26', 'Thừa Thiên–Huế' )
    ,( the_country_id, 'Province', '27', 'Quảng Nam' )
    ,( the_country_id, 'Province', '28', 'Kon Tum' )
    ,( the_country_id, 'Province', '29', 'Quảng Ngãi' )
    ,( the_country_id, 'Province', '30', 'Gia Lai' )
    ,( the_country_id, 'Province', '31', 'Bình Định' )
    ,( the_country_id, 'Province', '32', 'Phú Yên' )
    ,( the_country_id, 'Province', '33', 'Đắk Lắk' )
    ,( the_country_id, 'Province', '34', 'Khánh Hòa' )
    ,( the_country_id, 'Province', '35', 'Lâm Đồng' )
    ,( the_country_id, 'Province', '36', 'Ninh Thuận' )
    ,( the_country_id, 'Province', '37', 'Tây Ninh' )
    ,( the_country_id, 'Province', '39', 'Đồng Nai' )
    ,( the_country_id, 'Province', '40', 'Bình Thuận' )
    ,( the_country_id, 'Province', '41', 'Long An' )
    ,( the_country_id, 'Province', '43', 'Bà Rịa – Vũng Tàu' )
    ,( the_country_id, 'Province', '44', 'An Giang' )
    ,( the_country_id, 'Province', '45', 'Đồng Tháp' )
    ,( the_country_id, 'Province', '46', 'Tiền Giang' )
    ,( the_country_id, 'Province', '47', 'Kiến Giang' )
    ,( the_country_id, 'Province', '49', 'Vinh Long' )
    ,( the_country_id, 'Province', '50', 'Bến Tre' )
    ,( the_country_id, 'Province', '51', 'Trà Vinh' )
    ,( the_country_id, 'Province', '52', 'Sóc Trang' )
    ,( the_country_id, 'Province', '53', 'Bắc Kạn' )
    ,( the_country_id, 'Province', '54', 'Bắc Giang' )
    ,( the_country_id, 'Province', '55', 'Bạc Liêu' )
    ,( the_country_id, 'Province', '56', 'Bắc Ninh' )
    ,( the_country_id, 'Province', '57', 'Bình Duong' )
    ,( the_country_id, 'Province', '58', 'Bình Phước' )
    ,( the_country_id, 'Province', '59', 'Cà Mau' )
    ,( the_country_id, 'Province', '61', 'Hải Dương' )
    ,( the_country_id, 'Province', '63', 'Hà Nam' )
    ,( the_country_id, 'Province', '66', 'Hung Yên' )
    ,( the_country_id, 'Province', '67', 'Nam Định' )
    ,( the_country_id, 'Province', '68', 'Phú Thọ' )
    ,( the_country_id, 'Province', '69', 'Thái Nguyên' )
    ,( the_country_id, 'Province', '70', 'Vinh Phúc' )
    ,( the_country_id, 'Province', '71', 'Điện Biên' )
    ,( the_country_id, 'Province', '72', 'Đắk Nông' )
    ,( the_country_id, 'Province', '73', 'Hậu Giang' )
    ,( the_country_id, 'Municipality', 'CT', 'Can Tho' )
    ,( the_country_id, 'Municipality', 'DN', 'Da Nang, thanh pho' )
    ,( the_country_id, 'Municipality', 'HN', 'Ha Noi' )
    ,( the_country_id, 'Municipality', 'HP', 'Hai Phong' )
    ,( the_country_id, 'Municipality', 'SG', 'Ho Chi Minh' );
    
    -- Vanuatu
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'VU' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'MAP', 'Malampa' )
    ,( the_country_id, 'Province', 'PAM', 'Pénama' )
    ,( the_country_id, 'Province', 'SAM', 'Sanma' )
    ,( the_country_id, 'Province', 'SEE', 'Shéfa' )
    ,( the_country_id, 'Province', 'TAE', 'Taféa' )
    ,( the_country_id, 'Province', 'TOB', 'Torba' );
    
    -- Wallis and Futuna
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'WF' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Administrative Precinct', 'AL', 'Alo' )
    ,( the_country_id, 'Administrative Precinct', 'SG', 'Sigave' )
    ,( the_country_id, 'Administrative Precinct', 'UV', 'Uvea' );
    
    -- Samoa
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'WS' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'District', 'AA', 'A''ana' )
    ,( the_country_id, 'District', 'AL', 'Aiga-i-le-Tai' )
    ,( the_country_id, 'District', 'AT', 'Atua' )
    ,( the_country_id, 'District', 'FA', 'Fa''asaleleaga' )
    ,( the_country_id, 'District', 'GE', 'Gaga''emauga' )
    ,( the_country_id, 'District', 'GI', 'Gagaifomauga' )
    ,( the_country_id, 'District', 'PA', 'Palauli' )
    ,( the_country_id, 'District', 'SA', 'Satupa ''itea' )
    ,( the_country_id, 'District', 'TU', 'Tuamasaga' )
    ,( the_country_id, 'District', 'VF', 'Va''a-o-Fonoti' )
    ,( the_country_id, 'District', 'VS', 'Vaisigano' );
    
    -- Yemen
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'YE' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Governorate', 'AB', 'Abyān' )
    ,( the_country_id, 'Governorate', 'AD', '''Adan' )
    ,( the_country_id, 'Governorate', 'AM', '''Amrān' )
    ,( the_country_id, 'Governorate', 'BA', 'Al Bayḑā''' )
    ,( the_country_id, 'Governorate', 'DA', 'Aḑ Ḑāli''' )
    ,( the_country_id, 'Governorate', 'DH', 'Dhamar' )
    ,( the_country_id, 'Governorate', 'HD', 'Ḩaḑramawt' )
    ,( the_country_id, 'Governorate', 'HJ', 'Ḩajjah' )
    ,( the_country_id, 'Governorate', 'HU', 'Al Ḩudaydah' )
    ,( the_country_id, 'Governorate', 'IB', 'Ibb' )
    ,( the_country_id, 'Governorate', 'JA', 'Al Jawf' )
    ,( the_country_id, 'Governorate', 'LA', 'Lahij' )
    ,( the_country_id, 'Governorate', 'MA', 'Ma''rib' )
    ,( the_country_id, 'Governorate', 'MR', 'Al Mahrah' )
    ,( the_country_id, 'Governorate', 'MW', 'Al Maḩwīt' )
    ,( the_country_id, 'Governorate', 'RA', 'Raymah' )
    ,( the_country_id, 'Municipality', 'SA', 'Amanat al ‘Asimah [city]' )
    ,( the_country_id, 'Governorate', 'SD', 'Sa''dah' )
    ,( the_country_id, 'Governorate', 'SH', 'Shabwah' )
    ,( the_country_id, 'Governorate', 'SN', 'Şan‘ā''' )
    ,( the_country_id, 'Governorate', 'TA', 'Ta''izz' );
    
    -- South Africa
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'ZA' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'EC', 'Eastern Cape' )
    ,( the_country_id, 'Province', 'FS', 'Free State' )
    ,( the_country_id, 'Province', 'GT', 'Gauteng' )
    ,( the_country_id, 'Province', 'LP', 'Limpopo' )
    ,( the_country_id, 'Province', 'MP', 'Mpumalanga' )
    ,( the_country_id, 'Province', 'NC', 'Northern Cape' )
    ,( the_country_id, 'Province', 'NL', 'Kwazulu-Natal' )
    ,( the_country_id, 'Province', 'NW', 'North-West' )
    ,( the_country_id, 'Province', 'WC', 'Western Cape' );
    
    -- Zambia
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'ZM' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', '01', 'Western' )
    ,( the_country_id, 'Province', '02', 'Central' )
    ,( the_country_id, 'Province', '03', 'Eastern' )
    ,( the_country_id, 'Province', '04', 'Luapula' )
    ,( the_country_id, 'Province', '05', 'Northern' )
    ,( the_country_id, 'Province', '06', 'North-Western' )
    ,( the_country_id, 'Province', '07', 'Southern' )
    ,( the_country_id, 'Province', '08', 'Copperbelt' )
    ,( the_country_id, 'Province', '09', 'Lusaka' )
    ,( the_country_id, 'Province', '10', 'Muchinga' );
    
    -- Zimbabwe
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'ZW' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Province', 'BU', 'Bulawayo' )
    ,( the_country_id, 'Province', 'HA', 'Harare' )
    ,( the_country_id, 'Province', 'MA', 'Manicaland' )
    ,( the_country_id, 'Province', 'MC', 'Mashonaland Central' )
    ,( the_country_id, 'Province', 'ME', 'Mashonaland East' )
    ,( the_country_id, 'Province', 'MI', 'Midlands' )
    ,( the_country_id, 'Province', 'MN', 'Matabeleland North' )
    ,( the_country_id, 'Province', 'MS', 'Matabeleland South' )
    ,( the_country_id, 'Province', 'MV', 'Masvingo' )
    ,( the_country_id, 'Province', 'MW', 'Mashonaland West' );
    
    -- Hong Kong
    SELECT "Id" FROM "Country" WHERE "TwoLetterCode" = 'HK' INTO STRICT the_country_id;
    
    INSERT INTO "Region" ( "CountryId", "Label", "Code", "Name" )
    VALUES
     ( the_country_id, 'Region', 'HKI', 'Hong Kong Island' )
    ,( the_country_id, 'Region', 'KOW', 'Kowloon' )
    ,( the_country_id, 'Region', 'NT', 'New Territories' );
END
$$
LANGUAGE plpgsql;