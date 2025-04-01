import { useState, useEffect, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
} from "recharts";
import ReactDOM from "react-dom";

const useChat = (selectedChatId, onNewChat, refreshChats, logo, textGif) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [idChat, setIdChat] = useState(selectedChatId || null);
  const [quotedText, setQuotedText] = useState("");
  const [fileData, setFileData] = useState(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const demo = true;

  const barData = [
    { name: "GOMEZ CONSTRUCCIONES", approved: 210 },
    { name: "IBERCOM MULTICOM SA", approved: 198 },
    { name: "Bayton S.A.", approved: 195 },
    { name: "Maite Gimenez", approved: 193 },
    { name: "SUCASA COMUNICACIONES", approved: 187 },
  ];

  const pieData = [
    { name: "FACILITY SERVICE S.A.", approved: 456678 },
    { name: "MARKET LINE S.A.", approved: 306936 },
    { name: "VN GLOBAL BPO S.A.", approved: 252560 },
    { name: "AEGIS ARGENTINA S.A.", approved: 238659 },
    { name: "CENTRO INTERACCION MULTIMEDIA S.A.", approved: 237698 },
  ];

  // Colores dinámicos para las barras
  const barColors = [
    "#FF8042",
    "#FFBB28",
    "#0088FE",
    "#00C49F",
    "#FF6847",
    "#D9D9D9",
    "#FF6F91",
    "#A8DADC",
    "#457B9D",
  ];

  // Colores dinámicos para las porciones de la torta
  const pieColors = ["#FF8042", "#FFBB28", "#0088FE", "#00C49F", "#FF6847"];

  const BarGraphComponent = ({ data }) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={150} />
        <Tooltip />
        <Legend />
        {data.map((entry, index) => (
          <Bar
            key={index}
            dataKey="approved"
            fill={barColors[index % barColors.length]}
            barSize={30}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  const PieGraphComponent = ({ data }) => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="approved"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill={pieColors[0]} // El primer color de pieColors
          label
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={pieColors[index % pieColors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  const graphExport = (graphExportId) => {
    console.log(graphExportId);

    let graphComponent = null;
    let graphData = [];

    if (graphExportId === 1) {
      graphData = barData;
      graphComponent = <BarGraphComponent data={graphData} />;
    } else if (graphExportId === 2) {
      graphData = pieData;
      graphComponent = <PieGraphComponent data={graphData} />;
    } else {
      Swal.fire({
        title: "Warning",
        text: "Chart not available",
        icon: "warning",
        confirmButtonText: "Accept",
      });
      return;
    }

    Swal.fire({
      title:
        graphExportId === 1
          ? "Approved Documents (Bar Chart)"
          : "Suppliers with the Most Approved Documents (Pie Chart)",
      html: `<div id="chart-container" style="width: 100%; height: 400px; display: flex; justify-content: center; align-items: center;"></div>`,
      didOpen: () => {
        const chartContainer = document.getElementById("chart-container");
        ReactDOM.render(graphComponent, chartContainer);
      },
      showCloseButton: true,
      width: "80%",
      padding: "30px",
    });
  };

  const setFile = (fileObject) => {
    //(fileObject);
    if (!fileObject || !fileObject.name || !fileObject.content) {
      Swal.fire({
        title: "Warning",
        text: "Invalid document!",
        icon: "warning",
        confirmButtonText: "Accept",
      });
      return;
    }
    setFileData(fileObject);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() =>
      Swal.fire({
        title: "Success",
        text: "Text copied to clipboard!",
        icon: "success",
        confirmButtonText: "Accept",
      })
    );
  };

  useEffect(() => {
    if (!selectedChatId) return resetChat();
    setIdChat(selectedChatId);
    fetchChatHistory(selectedChatId);
  }, [selectedChatId]);

  const resetChat = () => {
    setMessages([]);
    setIdChat(null);
    setShowPrompts(true);
    setFileData(null);
  };

  const demoData = {
    history: [
      {
        relacion: 2,
        id: 3,
        chat_id: 1,
        sender: "user",
        content:
          "Detailed list of contractors with employees who have the highest number of documents pending review.",
        bot: 1,
        responseSQL: null,
        onRefresh: null,
        visible: true,
        files: [],
        created_at: "2025-03-27T09:01:25.602Z",
        role: "user",
      },
      {
        relacion: 2,
        id: 4,
        chat_id: 1,
        sender: "system",
        content:
          "Here’s a detailed list of contractors with the highest number of documents pending review:\n\n---\n\n### **Top Contractors with Pending Documents** 📄\n\n1. **MARKET LINE S.A.**  \n   - **Commercial Name:** CONTINUUM GBL  \n   - **CUIT:** 30-70725617-2  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **788**  \n\n2. **VATES S.A.**  \n   - **Commercial Name:** VATES SA  \n   - **CUIT:** 30-69850789-2  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **618**  \n\n3. **NOVACOR S.R.L.**  \n   - **Commercial Name:** NOVACOR CONSULTORA IT  \n   - **CUIT:** 30-70823602-7  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **577**  \n\n4. **DYNATACPHONE S.A.**  \n   - **Commercial Name:** DYNATACPHONE S.A.  \n   - **CUIT:** 30-70925043-0  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **382**  \n\n5. **AEGIS ARGENTINA S.A.**  \n   - **Commercial Name:** STARTEK  \n   - **CUIT:** 30-70984936-7  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **292**  \n\n6. **LOGICALIS ARGENTINA S.A.**  \n   - **Commercial Name:** LOGICALIS  \n   - **CUIT:** 33-62188555-9  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **160**  \n\n7. **GRUPO N S.A.**  \n   - **Commercial Name:** Grupo N S.A.  \n   - **CUIT:** 30-71084663-0  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **108**  \n\n8. **HECTOR ARMANDO GOMEZ**  \n   - **Commercial Name:** GOMEZ CONSTRUCCIONES  \n   - **CUIT:** 20-10238917-5  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **95**  \n\n9. **DESARROLLO FINANROUX CORP. S.A.**  \n   - **",
        bot: 0,
        responseSQL: [
          {
            supplier_legal_name: "MARKET LINE S.A.",
            supplier_trade_name: "CONTINUUM GBL",
            supplier_tax_id: "30707256172",
            supplier_nationality: "argentina",
            document_pending_quantity: "788",
          },
          {
            supplier_legal_name: "VATES S.A.",
            supplier_trade_name: "VATES SA",
            supplier_tax_id: "30698507892",
            supplier_nationality: "argentina",
            document_pending_quantity: "618",
          },
          {
            supplier_legal_name: "NOVACOR S.R.L.",
            supplier_trade_name: "NOVACOR CONSULTORA IT",
            supplier_tax_id: "30708236027",
            supplier_nationality: "argentina",
            document_pending_quantity: "577",
          },
          {
            supplier_legal_name: "DYNATACPHONE S.A.",
            supplier_trade_name: "DYNATACPHONE S.A.",
            supplier_tax_id: "30709250430",
            supplier_nationality: "argentina",
            document_pending_quantity: "382",
          },
          {
            supplier_legal_name: "AEGIS ARGENTINA S.A.",
            supplier_trade_name: "STARTEK",
            supplier_tax_id: "30709849367",
            supplier_nationality: "argentina",
            document_pending_quantity: "292",
          },
        ],
        onRefresh:
          "Here’s a detailed list of contractors with the highest number of documents pending review:\n\n---\n\n### **Top Contractors with Pending Documents** 📄\n\n1. **MARKET LINE S.A.**  \n   - **Commercial Name:** CONTINUUM GBL  \n   - **CUIT:** 30-70725617-2  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **788**  \n\n2. **VATES S.A.**  \n   - **Commercial Name:** VATES SA  \n   - **CUIT:** 30-69850789-2  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **618**  \n\n3. **NOVACOR S.R.L.**  \n   - **Commercial Name:** NOVACOR CONSULTORA IT  \n   - **CUIT:** 30-70823602-7  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **577**  \n\n4. **DYNATACPHONE S.A.**  \n   - **Commercial Name:** DYNATACPHONE S.A.  \n   - **CUIT:** 30-70925043-0  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **382**  \n\n5. **AEGIS ARGENTINA S.A.**  \n   - **Commercial Name:** STARTEK  \n   - **CUIT:** 30-70984936-7  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **292**  \n\n6. **LOGICALIS ARGENTINA S.A.**  \n   - **Commercial Name:** LOGICALIS  \n   - **CUIT:** 33-62188555-9  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **160**  \n\n7. **GRUPO N S.A.**  \n   - **Commercial Name:** Grupo N S.A.  \n   - **CUIT:** 30-71084663-0  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **108**  \n\n8. **HECTOR ARMANDO GOMEZ**  \n   - **Commercial Name:** GOMEZ CONSTRUCCIONES  \n   - **CUIT:** 20-10238917-5  \n   - **Nationality:** Argentina  \n   - **Pending Documents:** **95**  \n\n9. **DESARROLLO FINANROUX CORP. S.A.**  \n   - **",
        visible: true,
        files: [],
        created_at: "2025-03-27T09:02:00.000Z",
        role: "system",
      },
      {
        relacion: 3,
        id: 5,
        chat_id: 1,
        sender: "user",
        content:
          "List of contractors with the highest number of authorized employees.",
        bot: 0,
        responseSQL: null,
        onRefresh: null,
        visible: true,
        files: [],
        created_at: "2025-03-27T09:03:00.000Z",
        role: "user",
      },
      {
        relacion: 3,
        id: 6,
        chat_id: 1,
        sender: "system",
        content:
          "Here’s a list of contractors with the **highest number of authorized employees**: \n\n1. **MARKET LINE S.A.**  \n   - **Commercial Name:** CONTINUUM GBL  \n   - **CUIT:** 30707256172  \n   - **Authorized Employees:** **1592**  \n\n2. **CENTRO INTERACCION MULTIMEDIA S.A.**  \n   - **Commercial Name:** Apex  \n   - **CUIT:** 30708276800  \n   - **Authorized Employees:** **1507**  \n\n3. **AEGIS ARGENTINA S.A.**  \n   - **Commercial Name:** STARTEK  \n   - **CUIT:** 30709849367  \n   - **Authorized Employees:** **102**  \n\n4. **GESTAM ARGENTINA S.A.**  \n   - **Commercial Name:** GESTAM ARGENTINA S.A  \n   - **CUIT:** 30679636037  \n   - **Authorized Employees:** **99**  \n\n5. **DESARROLLO FINANROUX CORP. S.A.**  \n   - **Commercial Name:** DESARROLLO FINANROUX CORP  \n   - **CUIT:** 30710637527  \n   - **Authorized Employees:** **62**  \n\nFeel free to ask if you need more information! 😊",
        bot: 1,
        responseSQL: [
          {
            supplier_legal_name: "MARKET LINE S.A.",
            supplier_trade_name: "CONTINUUM GBL",
            supplier_tax_id: "30707256172",
            supplier_nationality: "argentina",
            authorized_employee_count: "1592",
          },
          {
            supplier_legal_name: "CENTRO INTERACCION MULTIMEDIA S.A.",
            supplier_trade_name: "Apex",
            supplier_tax_id: "30708276800",
            supplier_nationality: "argentina",
            authorized_employee_count: "1507",
          },
          {
            supplier_legal_name: "AEGIS ARGENTINA S.A.",
            supplier_trade_name: "STARTEK",
            supplier_tax_id: "30709849367",
            supplier_nationality: "argentina",
            authorized_employee_count: "102",
          },
          {
            supplier_legal_name: "GESTAM ARGENTINA S.A.",
            supplier_trade_name: "GESTAM ARGENTINA S.A",
            supplier_tax_id: "30679636037",
            supplier_nationality: "argentina",
            authorized_employee_count: "99",
          },
          {
            supplier_legal_name: "DESARROLLO FINANROUX CORP. S.A.",
            supplier_trade_name: "DESARROLLO FINANROUX CORP",
            supplier_tax_id: "30710637527",
            supplier_nationality: "argentina",
            authorized_employee_count: "62",
          },
        ],
        onRefresh:
          "Here’s a list of contractors with the **highest number of authorized employees**: \n\n1. **MARKET LINE S.A.**  \n   - **Commercial Name:** CONTINUUM GBL  \n   - **CUIT:** 30707256172  \n   - **Authorized Employees:** **1592**  \n\n2. **CENTRO INTERACCION MULTIMEDIA S.A.**  \n   - **Commercial Name:** Apex  \n   - **CUIT:** 30708276800  \n   - **Authorized Employees:** **1507**  \n\n3. **AEGIS ARGENTINA S.A.**  \n   - **Commercial Name:** STARTEK  \n   - **CUIT:** 30709849367  \n   - **Authorized Employees:** **102**  \n\n4. **GESTAM ARGENTINA S.A.**  \n   - **Commercial Name:** GESTAM ARGENTINA S.A  \n   - **CUIT:** 30679636037  \n   - **Authorized Employees:** **99**  \n\n5. **DESARROLLO FINANROUX CORP. S.A.**  \n   - **Commercial Name:** DESARROLLO FINANROUX CORP  \n   - **CUIT:** 30710637527  \n   - **Authorized Employees:** **62**  \n\nFeel free to ask if you need more information! 😊",
        visible: true,
        files: null,
        created_at: "2025-03-27T09:03:02.000Z",
        role: "system",
      },
      {
        relacion: 4,
        id: 7,
        chat_id: 1,
        sender: "user",
        content:
          "Top 5 suppliers with the highest number of employees with approved documentation.",
        bot: 0,
        responseSQL: null,
        onRefresh: null,
        visible: true,
        files: [],
        created_at: "2025-03-27T09:04:00.000Z",
        role: "user",
      },
      {
        relacion: 4,
        id: 8,
        chat_id: 1,
        sender: "system",
        content:
          "Here are the **top 5 suppliers** with the highest number of employees who have approved documentation: \n\n1. **FACILITY SERVICE S.A.**\n   - **Approved Employees:** 456,678\n   - **CUIT:** 30-71095356-9\n   - **Nationality:** Argentina\n\n2. **MARKET LINE S.A.**\n   - **Approved Employees:** 306,936\n   - **CUIT:** 30-70725617-2\n   - **Nationality:** Argentina\n\n3. **VN GLOBAL BPO S.A.**\n   - **Approved Employees:** 252,560\n   - **CUIT:** 30-69849822-2\n   - **Nationality:** Argentina\n\n4. **AEGIS ARGENTINA S.A.**\n   - **Approved Employees:** 238,659\n   - **CUIT:** 30-70984936-7\n   - **Nationality:** Argentina\n\n5. **CENTRO INTERACCION MULTIMEDIA S.A.**\n   - **Approved Employees:** 237,698\n   - **CUIT:** 30-70827680-0\n   - **Nationality:** Argentina\n\nIf you need more information or details, feel free to ask! 😊",
        bot: 1,
        responseSQL: [
          {
            supplier_legal_name: "FACILITY SERVICE S.A.",
            supplier_trade_name: "FACILITY SERVICE S.A.",
            supplier_tax_id: "30710953569",
            supplier_nationality: "argentina",
            employee_approved_quantity: "456678",
          },
          {
            supplier_legal_name: "MARKET LINE S.A.",
            supplier_trade_name: "CONTINUUM GBL",
            supplier_tax_id: "30707256172",
            supplier_nationality: "argentina",
            employee_approved_quantity: "306936",
          },
          {
            supplier_legal_name: "VN GLOBAL BPO S.A.",
            supplier_trade_name: "VN GLOBAL BPO S.A.",
            supplier_tax_id: "30698498222",
            supplier_nationality: "argentina",
            employee_approved_quantity: "252560",
          },
          {
            supplier_legal_name: "AEGIS ARGENTINA S.A.",
            supplier_trade_name: "STARTEK",
            supplier_tax_id: "30709849367",
            supplier_nationality: "argentina",
            employee_approved_quantity: "238659",
          },
          {
            supplier_legal_name: "CENTRO INTERACCION MULTIMEDIA S.A.",
            supplier_trade_name: "Apex",
            supplier_tax_id: "30708276800",
            supplier_nationality: "argentina",
            employee_approved_quantity: "237698",
          },
        ],
        onRefresh:
          "Here are the **top 5 suppliers** with the highest number of employees who have approved documentation: \n\n1. **FACILITY SERVICE S.A.**\n   - **Approved Employees:** 456,678\n   - **CUIT:** 30-71095356-9\n   - **Nationality:** Argentina\n\n2. **MARKET LINE S.A.**\n   - **Approved Employees:** 306,936\n   - **CUIT:** 30-70725617-2\n   - **Nationality:** Argentina\n\n3. **VN GLOBAL BPO S.A.**\n   - **Approved Employees:** 252,560\n   - **CUIT:** 30-69849822-2\n   - **Nationality:** Argentina\n\n4. **AEGIS ARGENTINA S.A.**\n   - **Approved Employees:** 238,659\n   - **CUIT:** 30-70984936-7\n   - **Nationality:** Argentina\n\n5. **CENTRO INTERACCION MULTIMEDIA S.A.**\n   - **Approved Employees:** 237,698\n   - **CUIT:** 30-70827680-0\n   - **Nationality:** Argentina\n\nIf you need more information or details, feel free to ask! 😊",
        visible: true,
        files: null,
        created_at: "2025-03-27T09:04:02.000Z",
        role: "system",
        graphExport: 2,
      },
      {
        relacion: 5,
        id: 9,
        chat_id: 1,
        sender: "user",
        content:
          "Detailed list of the 5 suppliers with the highest amount of approved documentation.",
        bot: 0,
        responseSQL: null,
        onRefresh: null,
        visible: true,
        files: [],
        created_at: "2025-03-27T09:05:00.000Z",
        role: "user",
      },
      {
        relacion: 5,
        id: 10,
        chat_id: 1,
        sender: "system",
        content:
          "Here’s a detailed list of the **5 suppliers** with the **highest amount of approved documentation**: \n\n2. **HECTOR ARMANDO GOMEZ**\n   - **Commercial Name:** GOMEZ CONSTRUCCIONES\n   - **CUIT:** 20-10238917-5\n   - **Nationality:** Argentina\n   - **Approved Documents:** **210** 📄\n\n3. **IBERCOM MULTICOM S.A.**\n   - **Commercial Name:** IBERCOM MULTICOM SA\n   - **CUIT:** 30-68210180-2\n   - **Nationality:** Argentina\n   - **Approved Documents:** **198** 📄\n\n4. **BAYTON S.A.**\n   - **Commercial Name:** Bayton S.A.\n   - **CUIT:** 33-57021065-9\n   - **Nationality:** Argentina\n   - **Approved Documents:** **195** 📄\n\n5. **TRADING INTERNACIONAL S.A.**\n   - **Commercial Name:** Maite Gimenez\n   - **CUIT:** 30-68544117-5\n   - **Nationality:** Argentina\n   - **Approved Documents:** **193** 📄",
        bot: 1,
        responseSQL: [
          {
            supplier_legal_name: "HECTOR ARMANDO GOMEZ",
            supplier_trade_name: "GOMEZ CONSTRUCCIONES",
            supplier_tax_id: "20102389175",
            supplier_nationality: "argentina",
            document_approved_quantity: "210",
          },
          {
            supplier_legal_name: "IBERCOM MULTICOM S.A.",
            supplier_trade_name: "IBERCOM MULTICOM SA ",
            supplier_tax_id: "30682101802",
            supplier_nationality: "argentina",
            document_approved_quantity: "198",
          },
          {
            supplier_legal_name: "BAYTON S.A.",
            supplier_trade_name: "Bayton S.A.",
            supplier_tax_id: "33570210659",
            supplier_nationality: "argentina",
            document_approved_quantity: "195",
          },
          {
            supplier_legal_name: "TRADING INTERNACIONAL S.A.",
            supplier_trade_name: "Maite Gimenez",
            supplier_tax_id: "30685441175",
            supplier_nationality: "argentina",
            document_approved_quantity: "193",
          },
          {
            supplier_legal_name: "SUCASA COMUNICACIONES S.A.",
            supplier_trade_name: "SUCASA COMUNICACIONES",
            supplier_tax_id: "30711263035",
            supplier_nationality: "argentina",
            document_approved_quantity: "187",
          },
        ],
        onRefresh:
          "Here’s a detailed list of the **5 suppliers** with the **highest amount of approved documentation**: \n\n2. **HECTOR ARMANDO GOMEZ**\n   - **Commercial Name:** GOMEZ CONSTRUCCIONES\n   - **CUIT:** 20-10238917-5\n   - **Nationality:** Argentina\n   - **Approved Documents:** **210** 📄\n\n3. **IBERCOM MULTICOM S.A.**\n   - **Commercial Name:** IBERCOM MULTICOM SA\n   - **CUIT:** 30-68210180-2\n   - **Nationality:** Argentina\n   - **Approved Documents:** **198** 📄\n\n4. **BAYTON S.A.**\n   - **Commercial Name:** Bayton S.A.\n   - **CUIT:** 33-57021065-9\n   - **Nationality:** Argentina\n   - **Approved Documents:** **195** 📄\n\n5. **TRADING INTERNACIONAL S.A.**\n   - **Commercial Name:** Maite Gimenez\n   - **CUIT:** 30-68544117-5\n   - **Nationality:** Argentina\n   - **Approved Documents:** **193** 📄",
        visible: true,
        files: null,
        created_at: "2025-03-27T09:05:02.000Z",
        role: "system",
        graphExport: 1,
      },
    ],
    id_chat: 1,
  };

  const fetchChatHistory = useCallback(async (id_chat) => {
    setInputDisabled(true);
    setShowPrompts(false);

    try {
      let data = null;
      if (!demo) {
        const response = await fetch(
          `http://localhost:5000/chat/obtener-chat/${id_chat}`
        );
        data = await response.json();
        console.log(data);
      }
      {
        data = demoData.history;
      }
      setMessages(formatMessages(data));
    } catch (e) {
      console.log(e);
      Swal.fire({
        title: "Error",
        text: "Failed to load history. Please try again.",
        icon: "error",
        confirmButtonText: "Accept",
      });
      resetChat();
    } finally {
      setLoading(false);
      setInputDisabled(false);
      setFileData(null);
    }
  }, []);

  const formatMessages = (history) =>
    history.map((item) => ({
      text: formatMessageText(item.content),
      isUser: item.sender === "user",
      responseSQL: item.responseSQL || null,
      onRefresh: item.onRefresh,
      created_at: item.created_at,
      files: item.files,
      graphExport: item.graphExport || false,
    }));

  const chatDemo = async (prompt) => {
    let historyDemo = {
      history: [],
      id_chat: 1,
    };

    await new Promise((resolve) => setTimeout(resolve, 2500));

    if (prompt) {
      const userM = demoData.history.find(
        (c) => c.sender === "user" && c.content.includes(prompt)
      );
      const systemM = userM
        ? demoData.history.find(
            (c) => c.sender === "system" && c.relacion === userM.relacion
          )
        : null;

      console.log(userM);
      console.log(systemM);

      if (!userM || !systemM) {
        historyDemo.history.push({
          sender: "user",
          content: prompt,
          bot: 0,
          responseSQL: null,
          onRefresh: null,
          visible: true,
          files: null,
          created_at: new Date().toISOString(),
          role: "user",
        });

        historyDemo.history.push({
          sender: "system",
          content:
            "Sorry, I am unable to provide an answer at the moment. Please try again later.",
          bot: 1,
          responseSQL: null,
          onRefresh: null,
          visible: true,
          files: null,
          created_at: new Date().toISOString(),
          role: "system",
        });
      } else {
        userM.created_at = new Date().toISOString();
        systemM.created_at = new Date().toISOString();
        historyDemo.history.push(userM);
        if (systemM) historyDemo.history.push(systemM);
      }
    }

    return historyDemo;
  };

  const fetchApiData = async (prompt) => {
    if (!prompt) {
      Swal.fire({
        title: "Warning",
        text: "Cannot send an empty query",
        icon: "warning",
        confirmButtonText: "Accept",
      });
      return;
    }

    const finalPrompt = quotedText
      ? `En relación a este contexto: \n \n ** ${quotedText} ** \n \n ${prompt}`
      : prompt;
    addMessage(finalPrompt, true);
    addMessage(
      `<img src=${textGif} alt="Descripción de la imagen" width="25">`,
      false,
      null,
      true
    );

    setLoading(true);
    setInputDisabled(true);
    setShowPrompts(false);

    try {
      //console.log(idChat);
      let response;
      if (!demo) {
        response = await sendApiRequest(finalPrompt, fileData);
      } else {
        response = await chatDemo(finalPrompt);
      }
      console.log(response);
      handleApiResponse(response);
    } catch (e) {
      console.log(e);
      addMessage(
        "Ocurrio un error, verifique su logica e intente nuevamente",
        false,
        finalPrompt
      );
    } finally {
      setFileData(null);
      setLoading(false);
      setInputDisabled(false);
      inputRef.current?.focus();
      setQuotedText("");
    }
  };

  const sendApiRequest = async (prompt, files = null) => {
    const body = {
      prompt,
      id_user: 1,
      id_chat: idChat,
      id_empresas: "5c339fb6-b458-11ec-9c2c-0e00717ac761",
      documents: [files],
    };

    if (!files) {
      body.documents = null;
    }

    //(body);
    const response = await fetch("http://localhost:5000/chat/enviar-mensaje", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return response.json();
  };

  const handleApiResponse = (data) => {
    console.log(data);
    if (data.id_chat && !idChat) {
      setIdChat(data.id_chat);
      onNewChat(data.id_chat);
      refreshChats();
    }

    if (data.history) {
      setMessages(formatMessages(data.history.filter((m) => m.visible)));
    } else {
      Swal.fire({
        title: "Error",
        text: "Failed to load history. Please try again.",
        icon: "error",
        confirmButtonText: "Accept",
      });
      resetChat();
    }
  };

  const addMessage = (
    message,
    isUser = true,
    OnRefreshError = null,
    preloader = false
  ) => {
    console.log(message, fileData);

    if (!message) return;

    if (OnRefreshError) {
      setMessages((prev) => [
        ...prev,
        {
          text: formatMessageText(message),
          isUser: false,
          error: true,
          onRefresh: formatMessageText(OnRefreshError),
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          preloader,
          text: isUser ? formatMessageText(message) : message,
          isUser,
          ...(fileData && { files: [fileData] }),
        },
      ]);
    }
  };

  const formatMessageText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  const exportToExcel = async (responseSQL) => {
    if (!Array.isArray(responseSQL) || responseSQL.length === 0)
      return Swal.fire({
        title: "Warning",
        text: "There is nothing to export",
        icon: "warning",
        confirmButtonText: "Accept",
      });

    setExporting(true);
    const worksheet = XLSX.utils.json_to_sheet(responseSQL);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    formatExcelColumns(worksheet, responseSQL);
    const fileName = `export_${new Date()
      .toLocaleTimeString()
      .replace(/:/g, "_")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    setExporting(false);
  };

  const formatExcelColumns = (worksheet, responseSQL) => {
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const columnWidth = Math.max(
        ...responseSQL.map((row) => String(row[Object.keys(row)[col]]).length),
        10
      );
      worksheet["!cols"] = worksheet["!cols"] || [];
      worksheet["!cols"][col] = { wch: columnWidth + 2 };
    }

    Object.keys(worksheet).forEach((key) => {
      if (!key.startsWith("!")) {
        const row = parseInt(key.match(/\d+/)[0], 10);
        if (row === 1)
          worksheet[key].v = worksheet[key].v.toUpperCase().replace(/_/g, " ");
      }
    });
  };

  const handleQuote = (text) => {
    setQuotedText(text);
    inputRef.current?.focus();
  };

  useEffect(() => {
    inputRef.current?.focus();
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return {
    messages,
    loading,
    exporting,
    inputDisabled,
    showPrompts,
    quotedText,
    inputRef,
    messagesEndRef,
    fetchApiData,
    addMessage,
    exportToExcel,
    handleQuote,
    logo,
    copyToClipboard,
    resetChat,
    setFile,
    graphExport,
  };
};

export default useChat;
