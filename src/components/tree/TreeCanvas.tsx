"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Loader2, User as UserIcon } from "lucide-react";

interface Person {
    id: string;
    firstName: string;
    lastName: string;
    gender: "MALE" | "FEMALE";
    imageUrl?: string;
    fatherId?: string;
    motherId?: string;
}

export function TreeCanvas() {
    const svgRef = useRef<SVGSVGElement>(null);
    const [loading, setLoading] = useState(true);
    const [people, setPeople] = useState<Person[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/people");
                const data = await res.json();
                setPeople(data);
            } catch (error) {
                console.error("Error fetching tree data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!svgRef.current || people.length === 0) return;

        const svg = d3.select(svgRef.current);
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;

        svg.selectAll("*").remove();

        const g = svg.append("g");

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 3])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        svg.call(zoom);

        // Build hierarchy
        // Current implementation uses Father as the primary parent for the tree structure
        const stratify = d3.stratify<Person>()
            .id(d => d.id)
            .parentId(d => d.fatherId || undefined);

        try {
            // Find roots (people without fatherId recorded)
            const roots = people.filter(p => !p.fatherId || !people.find(parent => parent.id === p.fatherId));

            // For simplicity, we'll pick the first root as the tree root
            // In a real app, you might want to handle multiple trees
            if (roots.length === 0) return;

            const root = d3.hierarchy(roots[0], (d) => {
                return people.filter(p => p.fatherId === d.id);
            });

            const treeLayout = d3.tree<Person>()
                .nodeSize([200, 200]);

            treeLayout(root);

            // Links
            g.append("g")
                .attr("fill", "none")
                .attr("stroke", "#1e293b")
                .attr("stroke-width", 2)
                .selectAll("path")
                .data(root.links())
                .join("path")
                .attr("d", d3.linkVertical()
                    .x((d: any) => d.x)
                    .y((d: any) => d.y) as any);

            // Nodes
            const node = g.append("g")
                .selectAll("g")
                .data(root.descendants())
                .join("g")
                .attr("transform", d => `translate(${d.x},${d.y})`);

            // Node Circle/Backdrop
            node.append("circle")
                .attr("r", 40)
                .attr("fill", d => d.data.gender === "MALE" ? "#2563eb" : "#db2777")
                .attr("stroke", "#0f172a")
                .attr("stroke-width", 4)
                .attr("class", "cursor-pointer transition-transform hover:scale-110");

            // Profile Image Clip Path
            node.append("clipPath")
                .attr("id", d => `clip-${d.data.id}`)
                .append("circle")
                .attr("r", 38);

            // Profile Image
            node.append("image")
                .attr("xlink:href", d => d.data.imageUrl || "")
                .attr("x", -38)
                .attr("y", -38)
                .attr("width", 76)
                .attr("height", 76)
                .attr("clip-path", d => `url(#clip-${d.data.id})`)
                .attr("preserveAspectRatio", "xMidYMid slice")
                .on("error", function (this: any) {
                    d3.select(this).style("display", "none");
                });

            // Fallback icon if no image
            node.append("text")
                .attr("class", "fill-white/20 text-3xl select-none")
                .attr("text-anchor", "middle")
                .attr("dy", "0.35em")
                .text(d => d.data.imageUrl ? "" : "👤");

            // Name
            const labelGroup = node.append("g")
                .attr("transform", "translate(0, 60)");

            labelGroup.append("rect")
                .attr("x", -60)
                .attr("y", -12)
                .attr("width", 120)
                .attr("height", 24)
                .attr("rx", 12)
                .attr("fill", "#1e293b")
                .attr("stroke", "#334155");

            labelGroup.append("text")
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .attr("fill", "white")
                .attr("font-size", "12px")
                .attr("font-weight", "bold")
                .text(d => `${d.data.firstName} ${d.data.lastName}`);

            // Center the tree
            const initialTransform = d3.zoomIdentity
                .translate(width / 2, 100)
                .scale(0.8);
            svg.call(zoom.transform, initialTransform);

        } catch (err) {
            console.error("Tree layout error:", err);
        }

    }, [people]);

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-slate-900/50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <svg
            ref={svgRef}
            className="h-full w-full cursor-grab active:cursor-grabbing outline-none"
        />
    );
}
