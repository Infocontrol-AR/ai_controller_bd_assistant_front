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
  ResponsiveContainer,
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

  const data = [
    { name: "GOMEZ CONSTRUCCIONES", approved: 210 },
    { name: "IBERCOM MULTICOM SA", approved: 198 },
    { name: "Bayton S.A.", approved: 195 },
    { name: "Maite Gimenez", approved: 193 },
    { name: "SUCASA COMUNICACIONES", approved: 187 },
    { name: "SAAVEDRA PARK SRL", approved: 183 },
    { name: "LATIN AMERICA POSTAL", approved: 182 },
    { name: "GRUPO TEC-COM S.R.L.", approved: 173 },
    { name: "ELIPGO SA", approved: 172 },
  ];

  const GraphComponent = () => (
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
        <Bar dataKey="approved" fill="#8884d8" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );

  const graphExport = (graphExportId) => {
    console.log(graphExportId);

    if (graphExportId != 1) {
      Swal.fire({
        title: "Warning",
        text: "Chart not available",
        icon: "warning",
        confirmButtonText: "Accept",
      });
      return;
    }

    Swal.fire({
      title: "Suppliers with the most approved documents",
      html: `<div id="chart-container" style="width: 100%; height: 400px; display: flex; justify-content: center; align-items: center;"></div>`,
      didOpen: () => {
        const chartContainer = document.getElementById("chart-container");
        ReactDOM.render(<GraphComponent />, chartContainer);
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
        title: "Advertencia",
        text: "Documento no valido!",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }
    setFileData(fileObject);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() =>
      Swal.fire({
        title: "Exito",
        text: "Texto Copiado al portapapeles!",
        icon: "success",
        confirmButtonText: "Aceptar",
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
            proveedor_nombre_razon_social: "MARKET LINE S.A.",
            proveedor_nombre_comercial: "CONTINUUM GBL",
            proveedor_cuit: "30707256172",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "788",
          },
          {
            proveedor_nombre_razon_social: "VATES S.A.",
            proveedor_nombre_comercial: "VATES SA",
            proveedor_cuit: "30698507892",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "618",
          },
          {
            proveedor_nombre_razon_social: "NOVACOR S.R.L.",
            proveedor_nombre_comercial: "NOVACOR CONSULTORA IT",
            proveedor_cuit: "30708236027",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "577",
          },
          {
            proveedor_nombre_razon_social: "DYNATACPHONE S.A.",
            proveedor_nombre_comercial: "DYNATACPHONE S.A.",
            proveedor_cuit: "30709250430",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "382",
          },
          {
            proveedor_nombre_razon_social: "AEGIS ARGENTINA S.A.",
            proveedor_nombre_comercial: "STARTEK",
            proveedor_cuit: "30709849367",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "292",
          },
          {
            proveedor_nombre_razon_social: "LOGICALIS ARGENTINA S.A.",
            proveedor_nombre_comercial: "LOGICALIS",
            proveedor_cuit: "33621885559",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "160",
          },
          {
            proveedor_nombre_razon_social: "GRUPO N S.A.",
            proveedor_nombre_comercial: "Grupo N S.A.",
            proveedor_cuit: "30710846630",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "108",
          },
          {
            proveedor_nombre_razon_social: "HECTOR ARMANDO GOMEZ",
            proveedor_nombre_comercial: "GOMEZ CONSTRUCCIONES",
            proveedor_cuit: "20102389175",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "95",
          },
          {
            proveedor_nombre_razon_social: "DESARROLLO FINANROUX CORP. S.A.",
            proveedor_nombre_comercial: "DESARROLLO FINANROUX CORP",
            proveedor_cuit: "30710637527",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "81",
          },
          {
            proveedor_nombre_razon_social: "TECNO VOZ NOROESTE S.A.",
            proveedor_nombre_comercial: "EVOLTIS",
            proveedor_cuit: "30698482253",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "80",
          },
          {
            proveedor_nombre_razon_social: "VOICENTER S.A.",
            proveedor_nombre_comercial: "VOICENTER",
            proveedor_cuit: "30708689064",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "55",
          },
          {
            proveedor_nombre_razon_social: "ICNET S.R.L.",
            proveedor_nombre_comercial: "ICNET S.R.L.",
            proveedor_cuit: "30709449849",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "52",
          },
          {
            proveedor_nombre_razon_social: "TECHMOVIL S.R.L.",
            proveedor_nombre_comercial: "TECHMOVIL",
            proveedor_cuit: "30716119390",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "51",
          },
          {
            proveedor_nombre_razon_social: "FABRICA S.R.L.",
            proveedor_nombre_comercial: "FABRICA SRL",
            proveedor_cuit: "30611977766",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "36",
          },
          {
            proveedor_nombre_razon_social: "VN GLOBAL BPO S.A.",
            proveedor_nombre_comercial: "VN GLOBAL BPO S.A.",
            proveedor_cuit: "30698498222",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "35",
          },
          {
            proveedor_nombre_razon_social: "FNET SYSTEM S.R.L.",
            proveedor_nombre_comercial: "FNETSYSTEM S.R.L.",
            proveedor_cuit: "30710235801",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "32",
          },
          {
            proveedor_nombre_razon_social: "IBERCOM MULTICOM S.A.",
            proveedor_nombre_comercial: "IBERCOM MULTICOM SA ",
            proveedor_cuit: "30682101802",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "32",
          },
          {
            proveedor_nombre_razon_social: "REDEX S.A.",
            proveedor_nombre_comercial: "REDEX SA",
            proveedor_cuit: "30709425796",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "26",
          },
          {
            proveedor_nombre_razon_social: "FIBERQUIL S.R.L.",
            proveedor_nombre_comercial: "FIBERQUIL S.R.L.",
            proveedor_cuit: "30709326046",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "20",
          },
          {
            proveedor_nombre_razon_social: "SOLFLIX S.A.",
            proveedor_nombre_comercial: "SOLFLIX S.A.",
            proveedor_cuit: "30687793486",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "17",
          },
          {
            proveedor_nombre_razon_social: "TC TECH S.R.L.",
            proveedor_nombre_comercial: "TCTECH",
            proveedor_cuit: "30711189692",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "17",
          },
          {
            proveedor_nombre_razon_social: "PROSEGUR S.A.",
            proveedor_nombre_comercial: "PROSEGUR SA",
            proveedor_cuit: "30575170125",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "16",
          },
          {
            proveedor_nombre_razon_social: "MOVIL NOA S.R.L.",
            proveedor_nombre_comercial: "MOVIL NOA SRL",
            proveedor_cuit: "30710061765",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "16",
          },
          {
            proveedor_nombre_razon_social: "NETMED S.A.S.",
            proveedor_nombre_comercial:
              "NETMED SOCIEDAD POR ACCIONES SIMPLIFICADA",
            proveedor_cuit: "30716024357",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "16",
          },
          {
            proveedor_nombre_razon_social: "LITORAL MOVIL S.R.L.",
            proveedor_nombre_comercial: "Litoral Movil",
            proveedor_cuit: "30710140401",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "14",
          },
          {
            proveedor_nombre_razon_social: "LINO MOVIL S.R.L.",
            proveedor_nombre_comercial: "Lino Movil",
            proveedor_cuit: "30715232681",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "12",
          },
          {
            proveedor_nombre_razon_social: "STARCEL PATAGONIA S.A.",
            proveedor_nombre_comercial: "STARCEL",
            proveedor_cuit: "30709552607",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "10",
          },
          {
            proveedor_nombre_razon_social: "CMR LA CONCORDIA S.A.",
            proveedor_nombre_comercial: "CMR LA CONCORDIA SA ",
            proveedor_cuit: "30708698209",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "9",
          },
          {
            proveedor_nombre_razon_social: "GESTAM ARGENTINA S.A.",
            proveedor_nombre_comercial: "GESTAM ARGENTINA S.A",
            proveedor_cuit: "30679636037",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "9",
          },
          {
            proveedor_nombre_razon_social: "RUILARSA S.R.L.",
            proveedor_nombre_comercial: "RUILARSA SRL",
            proveedor_cuit: "30711054401",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "8",
          },
          {
            proveedor_nombre_razon_social: "MIT INFORMATICA S.A.",
            proveedor_nombre_comercial: "Netacom",
            proveedor_cuit: "30710174667",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "8",
          },
          {
            proveedor_nombre_razon_social: "MOVILBIT S.A.",
            proveedor_nombre_comercial: "MOVILBIT SA",
            proveedor_cuit: "30714685828",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "8",
          },
          {
            proveedor_nombre_razon_social: "ATLANTICA TELECOMUNICACIONES S.A.",
            proveedor_nombre_comercial: "ATLANTICA TELECOMUNICACIONES SA",
            proveedor_cuit: "30656486380",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "8",
          },
          {
            proveedor_nombre_razon_social: "SERVICIOS SITEM S.A.",
            proveedor_nombre_comercial: "SERVICIOS SITEM SA",
            proveedor_cuit: "30693214250",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "6",
          },
          {
            proveedor_nombre_razon_social: "MOVILED S.A.",
            proveedor_nombre_comercial: "MOVILED",
            proveedor_cuit: "30714669709",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "6",
          },
          {
            proveedor_nombre_razon_social: "AR CONSULTORES S.R.L.",
            proveedor_nombre_comercial: "AR Consultores",
            proveedor_cuit: "30708954639",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "6",
          },
          {
            proveedor_nombre_razon_social: "MIG S.A.",
            proveedor_nombre_comercial: "MiG SA",
            proveedor_cuit: "30561265255",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "5",
          },
          {
            proveedor_nombre_razon_social: "SUCASA COMUNICACIONES S.A.",
            proveedor_nombre_comercial: "SUCASA COMUNICACIONES",
            proveedor_cuit: "30711263035",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "5",
          },
          {
            proveedor_nombre_razon_social: "G & G COMUNICACIONES S.R.L.",
            proveedor_nombre_comercial: "G&G Comunicaciones S.R.L.",
            proveedor_cuit: "30708669233",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "5",
          },
          {
            proveedor_nombre_razon_social: "SCA COMMUNICATIONS S.A.",
            proveedor_nombre_comercial: "Sca Communications S.A",
            proveedor_cuit: "30710680945",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "5",
          },
          {
            proveedor_nombre_razon_social: "NORTEC DESIGN S.R.L.",
            proveedor_nombre_comercial: "NORTEC DESIGN SRL",
            proveedor_cuit: "30715097911",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "5",
          },
          {
            proveedor_nombre_razon_social: "MOVIL GROUP S.R.L.",
            proveedor_nombre_comercial: "MOVIL GROUP S.R.L ",
            proveedor_cuit: "30710770030",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "4",
          },
          {
            proveedor_nombre_razon_social: "CONTRATISTA CLARO",
            proveedor_nombre_comercial: "CONTRATISTA CLARO",
            proveedor_cuit: "contratista.claro",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "4",
          },
          {
            proveedor_nombre_razon_social: "FACILITY SERVICE S.A.",
            proveedor_nombre_comercial: "FACILITY SERVICE S.A.",
            proveedor_cuit: "30710953569",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "4",
          },
          {
            proveedor_nombre_razon_social: "LUCOM SECURITY S.A.",
            proveedor_nombre_comercial: "Lucom Security",
            proveedor_cuit: "30707509518",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "4",
          },
          {
            proveedor_nombre_razon_social: "LINKTELCO TELECOMUNICACIONES S.A.",
            proveedor_nombre_comercial: "Linktelco Telecomunicaciones SA",
            proveedor_cuit: "30712453423",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "3",
          },
          {
            proveedor_nombre_razon_social: "ZOLUMAX S.R.L.",
            proveedor_nombre_comercial: "Zolumax Srl",
            proveedor_cuit: "30714985589",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "3",
          },
          {
            proveedor_nombre_razon_social: "COMUNICACIONES Y CONSUMOS S.R.L.",
            proveedor_nombre_comercial: "COMUNICACIONES Y CONSUMOS  SRL",
            proveedor_cuit: "30709641030",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "3",
          },
          {
            proveedor_nombre_razon_social: "CINETIK S.R.L.",
            proveedor_nombre_comercial: "CINETIK SRL",
            proveedor_cuit: "30709607622",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "3",
          },
          {
            proveedor_nombre_razon_social: "ATLANTICA INSTALACIONES S.A.",
            proveedor_nombre_comercial: "Atlantica Red de Servicios",
            proveedor_cuit: "30716710633",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "2",
          },
          {
            proveedor_nombre_razon_social: "SPANTECH S.A.",
            proveedor_nombre_comercial: "SPANTECH",
            proveedor_cuit: "30717984524",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "2",
          },
          {
            proveedor_nombre_razon_social: "INTER CONNECTION S.A.S.",
            proveedor_nombre_comercial: "INTER CONNECTION SAS",
            proveedor_cuit: "30715994816",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "2",
          },
          {
            proveedor_nombre_razon_social: "RED DE SERVICIOS S.A.",
            proveedor_nombre_comercial: "RED DE SERVICIOS S.A.",
            proveedor_cuit: "30716055635",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "2",
          },
          {
            proveedor_nombre_razon_social: "INTER ACCESORIOS S.R.L.",
            proveedor_nombre_comercial: "Inter Accesorios Srl",
            proveedor_cuit: "30712398554",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "2",
          },
          {
            proveedor_nombre_razon_social: "HIQUAL S.R.L.",
            proveedor_nombre_comercial: "HIQUAL",
            proveedor_cuit: "30710806892",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "2",
          },
          {
            proveedor_nombre_razon_social:
              "RECURSOS HUMANOS Y SOLUCIONES TECNOLOGICAS S.A.",
            proveedor_nombre_comercial: "RH TECNOLOGIA",
            proveedor_cuit: "30709993182",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "2",
          },
          {
            proveedor_nombre_razon_social: "EMAR CEIBA S.A.",
            proveedor_nombre_comercial: "EMAR CEIBA S.A.",
            proveedor_cuit: "30711501238",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "2",
          },
          {
            proveedor_nombre_razon_social: "TG2 S.R.L.",
            proveedor_nombre_comercial: "TG2 S.R.L",
            proveedor_cuit: "30710523467",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "2",
          },
          {
            proveedor_nombre_razon_social: "FONE GALETI S.R.L.",
            proveedor_nombre_comercial: "Fone Galeti S.R.L",
            proveedor_cuit: "30710405146",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "2",
          },
          {
            proveedor_nombre_razon_social: "DATACEL S.A.",
            proveedor_nombre_comercial: "DATACEL SA",
            proveedor_cuit: "33709227349",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "2",
          },
          {
            proveedor_nombre_razon_social: "BAZAN FABIAN MARTIN ANTONIO",
            proveedor_nombre_comercial: "BAZAN FABIAN MARTIN ANTONIO",
            proveedor_cuit: "20291752005",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "2",
          },
          {
            proveedor_nombre_razon_social: "COMUNICACIONES DEL SOL S.A.",
            proveedor_nombre_comercial: "Claro",
            proveedor_cuit: "30708702273",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "1",
          },
          {
            proveedor_nombre_razon_social: "LAS AMIGAS SIMPLE ASOCIACION",
            proveedor_nombre_comercial: "LAS AMIGAS",
            proveedor_cuit: "30715087967",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "1",
          },
          {
            proveedor_nombre_razon_social: "COTELSA S.R.L.",
            proveedor_nombre_comercial: "COTELSA SRL",
            proveedor_cuit: "30714476773",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "1",
          },
          {
            proveedor_nombre_razon_social: "LUCOM CORPO S.A.",
            proveedor_nombre_comercial: "Lucom Corpo",
            proveedor_cuit: "30716207796",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "1",
          },
          {
            proveedor_nombre_razon_social: "SAAVEDRA PARK S.R.L.",
            proveedor_nombre_comercial: "SAAVEDRA PARK SRL",
            proveedor_cuit: "33710415639",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "1",
          },
          {
            proveedor_nombre_razon_social: "NICOLINI MARTA ROSANA",
            proveedor_nombre_comercial: "Claro Agente Oficial",
            proveedor_cuit: "27233469462",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "1",
          },
          {
            proveedor_nombre_razon_social: "NASA S.A.",
            proveedor_nombre_comercial: "NASA SOCIEDAD ANONIMA",
            proveedor_cuit: "30710866496",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "1",
          },
          {
            proveedor_nombre_razon_social: "STRATTON NEA S.A.",
            proveedor_nombre_comercial: "KONECTA",
            proveedor_cuit: "33714037469",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "1",
          },
          {
            proveedor_nombre_razon_social: "GRUPO TEC-COM S.R.L.",
            proveedor_nombre_comercial: "GRUPO TEC-COM S.R.L.",
            proveedor_cuit: "30710773846",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "1",
          },
          {
            proveedor_nombre_razon_social: "COMERCIAL PHONE S.A.",
            proveedor_nombre_comercial: "Comercial Phone",
            proveedor_cuit: "30710686544",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_pendientes: "1",
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
            proveedor_nombre_razon_social: "MARKET LINE S.A.",
            proveedor_nombre_comercial: "CONTINUUM GBL",
            proveedor_cuit: "30707256172",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "1592",
          },
          {
            proveedor_nombre_razon_social: "CENTRO INTERACCION MULTIMEDIA S.A.",
            proveedor_nombre_comercial: "Apex",
            proveedor_cuit: "30708276800",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "1507",
          },
          {
            proveedor_nombre_razon_social: "AEGIS ARGENTINA S.A.",
            proveedor_nombre_comercial: "STARTEK",
            proveedor_cuit: "30709849367",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "102",
          },
          {
            proveedor_nombre_razon_social: "GESTAM ARGENTINA S.A.",
            proveedor_nombre_comercial: "GESTAM ARGENTINA S.A",
            proveedor_cuit: "30679636037",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "99",
          },
          {
            proveedor_nombre_razon_social: "DESARROLLO FINANROUX CORP. S.A.",
            proveedor_nombre_comercial: "DESARROLLO FINANROUX CORP",
            proveedor_cuit: "30710637527",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "62",
          },
          {
            proveedor_nombre_razon_social: "EMAR CEIBA S.A.",
            proveedor_nombre_comercial: "EMAR CEIBA S.A.",
            proveedor_cuit: "30711501238",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "37",
          },
          {
            proveedor_nombre_razon_social: "FABRICA S.R.L.",
            proveedor_nombre_comercial: "FABRICA SRL",
            proveedor_cuit: "30611977766",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "35",
          },
          {
            proveedor_nombre_razon_social: "ICNET S.R.L.",
            proveedor_nombre_comercial: "ICNET S.R.L.",
            proveedor_cuit: "30709449849",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "28",
          },
          {
            proveedor_nombre_razon_social: "DYNATACPHONE S.A.",
            proveedor_nombre_comercial: "DYNATACPHONE S.A.",
            proveedor_cuit: "30709250430",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "21",
          },
          {
            proveedor_nombre_razon_social: "MOVILED S.A.",
            proveedor_nombre_comercial: "MOVILED",
            proveedor_cuit: "30714669709",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "12",
          },
          {
            proveedor_nombre_razon_social: "HECTOR ARMANDO GOMEZ",
            proveedor_nombre_comercial: "GOMEZ CONSTRUCCIONES",
            proveedor_cuit: "20102389175",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "12",
          },
          {
            proveedor_nombre_razon_social:
              "CONSULTORES DE EMPRESAS I.T. S.R.L.",
            proveedor_nombre_comercial: "CONSULTORES DE EMPRESAS I.T S.R.L",
            proveedor_cuit: "33715730869",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "7",
          },
          {
            proveedor_nombre_razon_social: "LUCOM SECURITY S.A.",
            proveedor_nombre_comercial: "Lucom Security",
            proveedor_cuit: "30707509518",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "6",
          },
          {
            proveedor_nombre_razon_social: "STRATTON NEA S.A.",
            proveedor_nombre_comercial: "KONECTA",
            proveedor_cuit: "33714037469",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "5",
          },
          {
            proveedor_nombre_razon_social: "DERBY S.A.",
            proveedor_nombre_comercial: "DERBY SOCIEDAD ANONIMA",
            proveedor_cuit: "30708678941",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "5",
          },
          {
            proveedor_nombre_razon_social: "AR CONSULTORES S.R.L.",
            proveedor_nombre_comercial: "AR Consultores",
            proveedor_cuit: "30708954639",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "4",
          },
          {
            proveedor_nombre_razon_social: "LOGICALIS ARGENTINA S.A.",
            proveedor_nombre_comercial: "LOGICALIS",
            proveedor_cuit: "33621885559",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "4",
          },
          {
            proveedor_nombre_razon_social: "NORTEC DESIGN S.R.L.",
            proveedor_nombre_comercial: "NORTEC DESIGN SRL",
            proveedor_cuit: "30715097911",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "3",
          },
          {
            proveedor_nombre_razon_social: "GESTION BUENOS AIRES S.A.",
            proveedor_nombre_comercial: "GESTION BUENOS AIRES S.A",
            proveedor_cuit: "30709019941",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "3",
          },
          {
            proveedor_nombre_razon_social: "CUATRO NORTES S.R.L.",
            proveedor_nombre_comercial: "CUATRONORTES SRL",
            proveedor_cuit: "30708809620",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "2",
          },
          {
            proveedor_nombre_razon_social: "NASA S.A.",
            proveedor_nombre_comercial: "NASA SOCIEDAD ANONIMA",
            proveedor_cuit: "30710866496",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "2",
          },
          {
            proveedor_nombre_razon_social: "ECO TV S.A.",
            proveedor_nombre_comercial: "ECOTV SA",
            proveedor_cuit: "30695821693",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "2",
          },
          {
            proveedor_nombre_razon_social: "LUCOM CORPO S.A.",
            proveedor_nombre_comercial: "Lucom Corpo",
            proveedor_cuit: "30716207796",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "2",
          },
          {
            proveedor_nombre_razon_social: "SCA COMMUNICATIONS S.A.",
            proveedor_nombre_comercial: "Sca Communications S.A",
            proveedor_cuit: "30710680945",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "2",
          },
          {
            proveedor_nombre_razon_social: "NOVACOR S.R.L.",
            proveedor_nombre_comercial: "NOVACOR CONSULTORA IT",
            proveedor_cuit: "30708236027",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "2",
          },
          {
            proveedor_nombre_razon_social: "REDUCCION CELULARES S.R.L.",
            proveedor_nombre_comercial: "COLFRE",
            proveedor_cuit: "33711160219",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "1",
          },
          {
            proveedor_nombre_razon_social: "ICH S.A.",
            proveedor_nombre_comercial: "ICH SA",
            proveedor_cuit: "30709769169",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "1",
          },
          {
            proveedor_nombre_razon_social: "CMR LA CONCORDIA S.A.",
            proveedor_nombre_comercial: "CMR LA CONCORDIA SA ",
            proveedor_cuit: "30708698209",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "1",
          },
          {
            proveedor_nombre_razon_social: "FACILITY SERVICE S.A.",
            proveedor_nombre_comercial: "FACILITY SERVICE S.A.",
            proveedor_cuit: "30710953569",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "1",
          },
          {
            proveedor_nombre_razon_social: "CONTRATISTA CLARO",
            proveedor_nombre_comercial: "CONTRATISTA CLARO",
            proveedor_cuit: "contratista.claro",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "1",
          },
          {
            proveedor_nombre_razon_social: "CEIBA UNO S. A.",
            proveedor_nombre_comercial: "CEIBA UNO S. A.",
            proveedor_cuit: "33718123629",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "1",
          },
          {
            proveedor_nombre_razon_social: "MOVILSAT COMUNICACIONES S.A.",
            proveedor_nombre_comercial: "Movilsat Comunicaciones",
            proveedor_cuit: "30709157589",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "1",
          },
          {
            proveedor_nombre_razon_social: "THINKING GREEN S.A.",
            proveedor_nombre_comercial: "Apex",
            proveedor_cuit: "30714247405",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "1",
          },
          {
            proveedor_nombre_razon_social: "CINETIK S.R.L.",
            proveedor_nombre_comercial: "CINETIK SRL",
            proveedor_cuit: "30709607622",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "1",
          },
          {
            proveedor_nombre_razon_social: "DATACEL S.A.",
            proveedor_nombre_comercial: "DATACEL SA",
            proveedor_cuit: "33709227349",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "1",
          },
          {
            proveedor_nombre_razon_social: "VN GLOBAL BPO S.A.",
            proveedor_nombre_comercial: "VN GLOBAL BPO S.A.",
            proveedor_cuit: "30698498222",
            proveedor_nacionalidad: "argentina",
            cantidad_empleados_autorizados: "1",
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
            proveedor_nombre_razon_social: "FACILITY SERVICE S.A.",
            proveedor_nombre_comercial: "FACILITY SERVICE S.A.",
            proveedor_cuit: "30710953569",
            proveedor_nacionalidad: "argentina",
            empleado_cantidad_aprobados: "456678",
          },
          {
            proveedor_nombre_razon_social: "MARKET LINE S.A.",
            proveedor_nombre_comercial: "CONTINUUM GBL",
            proveedor_cuit: "30707256172",
            proveedor_nacionalidad: "argentina",
            empleado_cantidad_aprobados: "306936",
          },
          {
            proveedor_nombre_razon_social: "VN GLOBAL BPO S.A.",
            proveedor_nombre_comercial: "VN GLOBAL BPO S.A.",
            proveedor_cuit: "30698498222",
            proveedor_nacionalidad: "argentina",
            empleado_cantidad_aprobados: "252560",
          },
          {
            proveedor_nombre_razon_social: "AEGIS ARGENTINA S.A.",
            proveedor_nombre_comercial: "STARTEK",
            proveedor_cuit: "30709849367",
            proveedor_nacionalidad: "argentina",
            empleado_cantidad_aprobados: "238659",
          },
          {
            proveedor_nombre_razon_social: "CENTRO INTERACCION MULTIMEDIA S.A.",
            proveedor_nombre_comercial: "Apex",
            proveedor_cuit: "30708276800",
            proveedor_nacionalidad: "argentina",
            empleado_cantidad_aprobados: "237698",
          },
        ],
        onRefresh:
          "Here are the **top 5 suppliers** with the highest number of employees who have approved documentation: \n\n1. **FACILITY SERVICE S.A.**\n   - **Approved Employees:** 456,678\n   - **CUIT:** 30-71095356-9\n   - **Nationality:** Argentina\n\n2. **MARKET LINE S.A.**\n   - **Approved Employees:** 306,936\n   - **CUIT:** 30-70725617-2\n   - **Nationality:** Argentina\n\n3. **VN GLOBAL BPO S.A.**\n   - **Approved Employees:** 252,560\n   - **CUIT:** 30-69849822-2\n   - **Nationality:** Argentina\n\n4. **AEGIS ARGENTINA S.A.**\n   - **Approved Employees:** 238,659\n   - **CUIT:** 30-70984936-7\n   - **Nationality:** Argentina\n\n5. **CENTRO INTERACCION MULTIMEDIA S.A.**\n   - **Approved Employees:** 237,698\n   - **CUIT:** 30-70827680-0\n   - **Nationality:** Argentina\n\nIf you need more information or details, feel free to ask! 😊",
        visible: true,
        files: null,
        created_at: "2025-03-27T09:04:02.000Z",
        role: "system",
        graphExport: 0,
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
            proveedor_nombre_razon_social: "HECTOR ARMANDO GOMEZ",
            proveedor_nombre_comercial: "GOMEZ CONSTRUCCIONES",
            proveedor_cuit: "20102389175",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_aprobados: "210",
          },
          {
            proveedor_nombre_razon_social: "IBERCOM MULTICOM S.A.",
            proveedor_nombre_comercial: "IBERCOM MULTICOM SA ",
            proveedor_cuit: "30682101802",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_aprobados: "198",
          },
          {
            proveedor_nombre_razon_social: "BAYTON S.A.",
            proveedor_nombre_comercial: "Bayton S.A. ",
            proveedor_cuit: "33570210659",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_aprobados: "195",
          },
          {
            proveedor_nombre_razon_social: "TRADING INTERNACIONAL S.A.",
            proveedor_nombre_comercial: "Maite Gimenez",
            proveedor_cuit: "30685441175",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_aprobados: "193",
          },
          {
            proveedor_nombre_razon_social: "SUCASA COMUNICACIONES S.A.",
            proveedor_nombre_comercial: "SUCASA COMUNICACIONES",
            proveedor_cuit: "30711263035",
            proveedor_nacionalidad: "argentina",
            documento_cantidad_aprobados: "187",
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
        text: "No se pudo cargar el historial. Por favor, inténtalo nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
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
        title: "Advertencia",
        text: "No se puede enviar una consulta vacia",
        icon: "warning",
        confirmButtonText: "Aceptar",
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
        text: "No se pudo cargar el historial. Por favor, inténtalo nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
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
        title: "Advertencia",
        text: "No hay nada para exportar",
        icon: "warning",
        confirmButtonText: "Aceptar",
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
