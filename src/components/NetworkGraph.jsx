import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { RenderGraph } from "./RenderGraph";
import "./NetworkGraph.css";

const NetworkGraph = ({ selectedCommunity }) => {
  const [nodesData, setNodesData] = useState(null);
  const [relationshipsData, setRelationshipsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const graphRef = useRef();
  const simulationRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const nodesResponse = await fetch(
          `${import.meta.env.BASE_URL}nodes.json`
        );
        const nodesData = await nodesResponse.json();
        setNodesData(nodesData);

        const relationshipsResponse = await fetch(
          `${import.meta.env.BASE_URL}relationships.json`
        );
        const relationshipsData = await relationshipsResponse.json();
        setRelationshipsData(relationshipsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCommunity && nodesData && relationshipsData) {
      const communityNodes = nodesData[selectedCommunity]?.nodes || [];
      const communityRelationships =
        relationshipsData[selectedCommunity]?.[selectedCommunity] || [];

      const nodes = communityNodes.map((node) => ({
        id: node.id,
        label: `Id: ${node.id}\nCity: ${node.city}`,
      }));

      const links = communityRelationships.map((relation) => ({
        source: relation.from,
        target: relation.to,
      }));

      RenderGraph(nodes, links, graphRef, simulationRef);
    }
  }, [selectedCommunity, nodesData, relationshipsData]);

  return (
    <div ref={graphRef} className="network-graph-container">
      {!selectedCommunity && <p>Select a community to view graph.</p>}
      {selectedCommunity && isLoading && <div className="spinner"></div>}
    </div>
  );
};

NetworkGraph.propTypes = {
  selectedCommunity: PropTypes.string, // ← No .isRequired
};

export default NetworkGraph;
