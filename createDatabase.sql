--SQL koji se koristio za stvaranje baze
CREATE TABLE tracking(
	trackingCode VARCHAR(30) PRIMARY KEY,
	carrierTrackingURL VARCHAR(200),
	trackingDate DATE	
);

CREATE TABLE customer(
	customerID VARCHAR(20) PRIMARY KEY,
	customerName VARCHAR(30),
	customerDescription VARCHAR(200)
);

CREATE TABLE shipment (
	shipmentID INT PRIMARY KEY,
	trackingCode VARCHAR(30) REFERENCES tracking(trackingCode),
	carrier VARCHAR(50),
	status VARCHAR(20),
	weight DECIMAL, 
	addressTo VARCHAR(50), --adrese bi trebale biti vlastita relacija ili 
	addressFrom VARCHAR(50), --čak više njih no nemam vremena implementirati
	createDate DATE,
	customerID VARCHAR(20) REFERENCES customer(customerID)
);